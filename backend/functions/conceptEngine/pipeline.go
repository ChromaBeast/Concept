package handler

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/appwrite/sdk-for-go/id"
	"github.com/appwrite/sdk-for-go/query"
)

type ContentPipeline struct {
	db        *databases.Databases
	gemini    *GeminiClient
	validator *ContentValidator
	config    PipelineConfig
}

func NewContentPipeline(cfg PipelineConfig) *ContentPipeline {
	client := appwrite.NewClient(
		appwrite.WithEndpoint(cfg.Endpoint),
		appwrite.WithProject(cfg.ProjectID),
		appwrite.WithKey(cfg.APIKey),
	)
	gemini := NewGeminiClient(cfg.GeminiKey)
	validator := NewContentValidator(gemini, cfg.ValidatorModel)

	return &ContentPipeline{
		db:        databases.New(client),
		gemini:    gemini,
		validator: validator,
		config:    cfg,
	}
}

func (p *ContentPipeline) RunBatch(batchSize int) (int, int, error) {
	if batchSize <= 0 {
		batchSize = p.config.BatchSize
	}
	if batchSize <= 0 {
		batchSize = 5
	}

	res, err := p.db.ListDocuments(
		p.config.DatabaseID,
		"roadmapTopics",
		p.db.WithListDocumentsQueries([]string{
			query.Equal("status", []string{"pending"}),
			query.OrderDesc("priority"),
			query.Limit(batchSize),
		}),
	)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to fetch roadmap topics: %w", err)
	}

	var topics []RoadmapTopicDoc
	for _, doc := range res.Documents {
		var item RoadmapTopicDoc
		if err := doc.Decode(&item); err == nil {
			item.ID = doc.Id
			topics = append(topics, item)
		}
	}

	if len(topics) == 0 {
		return 0, 0, nil
	}

	sem := make(chan struct{}, p.config.MaxConcurrency)
	var wg sync.WaitGroup
	var publishedCount, reviewedCount int
	var mu sync.Mutex

	for _, t := range topics {
		wg.Add(1)
		go func(topic RoadmapTopicDoc) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			status, err := p.processTopic(topic)
			mu.Lock()
			if err == nil {
				if status == "published" {
					publishedCount++
				} else if status == "needs_review" {
					reviewedCount++
				}
			}
			mu.Unlock()
		}(t)
	}
	wg.Wait()

	return publishedCount, reviewedCount, nil
}

func (p *ContentPipeline) processTopic(topic RoadmapTopicDoc) (string, error) {
	_, _ = p.db.UpdateDocument(
		p.config.DatabaseID,
		"roadmapTopics",
		topic.ID,
		p.db.WithUpdateDocumentData(map[string]interface{}{
			"status": "claimed",
		}),
	)

	draft, err := p.gemini.GenerateConcept(topic.Topic, topic.Category, topic.Difficulty, p.config.GeminiModel)
	if err != nil {
		_, _ = p.db.UpdateDocument(
			p.config.DatabaseID,
			"roadmapTopics",
			topic.ID,
			p.db.WithUpdateDocumentData(map[string]interface{}{
				"status":    "failed",
				"attempts":  topic.Attempts + 1,
				"lastError": err.Error(),
			}),
		)
		return "failed", err
	}

	validation := p.validator.Validate(draft)
	status := "published"
	if !validation.Approved {
		status = "needs_review"
	}

	bodyJSON, _ := json.Marshal(draft.Body)
	docData := map[string]interface{}{
		"slug":                 draft.Slug,
		"title":                draft.Title,
		"oneLiner":             draft.OneLiner,
		"category":             draft.Category,
		"difficulty":           draft.Difficulty,
		"body":                 string(bodyJSON),
		"estimatedReadSeconds": draft.EstimatedReadSeconds,
		"status":               status,
		"source":               "ai_generated",
		"aiModel":              p.config.GeminiModel,
		"visualAid":            draft.VisualAid,
		"imagePrompt":          draft.ImagePrompt,
		"needsReviewReasons":   validation.Reasons,
	}

	_, err = p.db.CreateDocument(
		p.config.DatabaseID,
		"concepts",
		id.Unique(),
		docData,
	)
	if err != nil {
		return "failed", err
	}

	_, _ = p.db.UpdateDocument(
		p.config.DatabaseID,
		"roadmapTopics",
		topic.ID,
		p.db.WithUpdateDocumentData(map[string]interface{}{
			"status": "done",
		}),
	)

	return status, nil
}
