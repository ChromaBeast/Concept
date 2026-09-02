package handler

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/appwrite/sdk-for-go/id"
	"github.com/appwrite/sdk-for-go/query"
	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

const (
	CollectionRoadmapTopics = "roadmapTopics"
	CollectionConcepts      = "concepts"
	CollectionPipelineRuns  = "pipelineRuns"
	MaxRetries              = 2
)

// RunPipeline orchestrates the fetch, claim, generation, validation, and storage of concepts.
func RunPipeline(ctx *openruntimes.Context, cfg *PipelineConfig) (*PipelineRunDoc, error) {
	startedAt := time.Now().UTC().Format(time.RFC3339)
	ctx.Log(fmt.Sprintf("Starting content pipeline run at %s with batch size %d", startedAt, cfg.BatchSize))

	client := appwrite.NewClient(
		appwrite.WithEndpoint(cfg.Endpoint),
		appwrite.WithProject(cfg.ProjectID),
		appwrite.WithKey(cfg.APIKey),
	)
	db := databases.New(client)
	gemini := NewGeminiClient(cfg.GeminiAPIKey, cfg.AIModel, cfg.ValidatorModel)

	// Step 1: Query pending topics
	docsList, err := db.ListDocuments(
		cfg.DatabaseID,
		CollectionRoadmapTopics,
		db.WithListDocumentsQueries([]string{
			query.Equal("status", "pending"),
			query.Limit(cfg.BatchSize),
			query.OrderDesc("priority"),
		}),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query pending roadmap topics: %w", err)
	}

	var claimedTopics []RoadmapTopicDoc
	for _, doc := range docsList.Documents {
		var item RoadmapTopicDoc
		if err := doc.Decode(&item); err != nil {
			continue
		}
		item.ID = doc.Id

		// Step 2: Optimistic claim
		_, claimErr := db.UpdateDocument(
			cfg.DatabaseID,
			CollectionRoadmapTopics,
			item.ID,
			db.WithUpdateDocumentData(map[string]any{"status": "claimed"}),
		)
		if claimErr == nil {
			claimedTopics = append(claimedTopics, item)
		}
	}

	ctx.Log(fmt.Sprintf("Successfully claimed %d topics for processing", len(claimedTopics)))

	// Step 3: Process with bounded concurrency
	concurrency := cfg.Concurrency
	if concurrency <= 0 {
		concurrency = 3
	}
	sem := make(chan struct{}, concurrency)
	var wg sync.WaitGroup
	var mu sync.Mutex

	runSummary := &PipelineRunDoc{
		StartedAt: startedAt,
		Attempted: len(claimedTopics),
		Errors:    []string{},
	}

	for _, t := range claimedTopics {
		wg.Add(1)
		sem <- struct{}{}
		go func(topic RoadmapTopicDoc) {
			defer wg.Done()
			defer func() { <-sem }()

			pub, rev, err := processTopic(ctx, db, gemini, cfg, topic)
			mu.Lock()
			defer mu.Unlock()
			if err != nil {
				runSummary.Failed++
				runSummary.Errors = append(runSummary.Errors, fmt.Sprintf("%s: %v", topic.Topic, err))
			} else if pub {
				runSummary.Published++
			} else if rev {
				runSummary.NeedsReview++
			}
		}(t)
	}
	wg.Wait()

	runSummary.FinishedAt = time.Now().UTC().Format(time.RFC3339)

	// Step 4: Record pipeline run summary
	_, _ = db.CreateDocument(
		cfg.DatabaseID,
		CollectionPipelineRuns,
		id.Unique(),
		runSummary,
	)

	ctx.Log(fmt.Sprintf("Pipeline finished: Published=%d, NeedsReview=%d, Failed=%d",
		runSummary.Published, runSummary.NeedsReview, runSummary.Failed))

	return runSummary, nil
}

// processTopic handles generating, validating, writing the concept, and updating the topic.
func processTopic(
	ctx *openruntimes.Context,
	db *databases.Databases,
	gemini *GeminiClient,
	cfg *PipelineConfig,
	topic RoadmapTopicDoc,
) (isPublished bool, isNeedsReview bool, err error) {
	var payload *GeneratedConceptPayload
	var valResult ValidationResult

	// Retry loop for generation & word count
	for attempt := 0; attempt <= MaxRetries; attempt++ {
		payload, err = gemini.GenerateConcept(topic.Topic, topic.Category, topic.Difficulty)
		if err != nil {
			continue
		}
		valResult = ValidateConcept(payload, gemini)
		if valResult.Passed {
			break
		}
	}

	if payload == nil {
		_, _ = db.UpdateDocument(cfg.DatabaseID, CollectionRoadmapTopics, topic.ID,
			db.WithUpdateDocumentData(map[string]any{"status": "failed", "attempts": topic.Attempts + 1}))
		return false, false, fmt.Errorf("generation failed after retries: %w", err)
	}

	bodyJSON, _ := json.Marshal(ConceptBody{
		Definition:     payload.Definition,
		WhyItMatters:   payload.WhyItMatters,
		Example:        payload.Example,
		CommonPitfall:  payload.CommonPitfall,
		InterviewAngle: payload.InterviewAngle,
		QuickChecks:    payload.QuickChecks,
	})

	status := "published"
	if !valResult.Passed {
		status = "needs_review"
	}

	var tags []string
	for _, tag := range payload.SuggestedTags {
		if norm := NormalizeTag(tag); norm != "" {
			tags = append(tags, norm)
		}
	}

	nowStr := time.Now().UTC().Format(time.RFC3339)
	readSeconds := CalculateReadSeconds(valResult.WordCount)
	oneLiner := GenerateOneLiner(payload.Definition)

	conceptDoc := ConceptDoc{
		Slug:                Slugify(topic.Topic),
		Title:               topic.Topic,
		OneLiner:            oneLiner,
		Category:            topic.Category,
		TagIDs:              tags,
		Difficulty:          topic.Difficulty,
		Body:                string(bodyJSON),
		EstimatedReadSeconds: readSeconds,
		Status:              status,
		Source:              "ai_generated",
		AIModel:             cfg.AIModel,
		PromptVersion:       cfg.PromptVersion,
		CreatedAt:           nowStr,
		UpdatedAt:           nowStr,
		ViewCount:           0,
		BookmarkCount:       0,
		VisualAid:           payload.VisualAid,
		ImagePrompt:         payload.ImagePrompt,
		NeedsReviewReasons:  valResult.Reasons,
	}

	_, err = db.CreateDocument(cfg.DatabaseID, CollectionConcepts, id.Unique(), conceptDoc)
	if err != nil {
		return false, false, fmt.Errorf("failed to save concept doc: %w", err)
	}

	_, _ = db.UpdateDocument(cfg.DatabaseID, CollectionRoadmapTopics, topic.ID,
		db.WithUpdateDocumentData(map[string]any{"status": "done", "attempts": topic.Attempts + 1}))

	return status == "published", status == "needs_review", nil
}
