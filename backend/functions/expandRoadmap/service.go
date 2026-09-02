package handler

import (
	"fmt"
	"strings"
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
)

// ExpandRoadmapService executes the roadmap replenishment workflow.
func ExpandRoadmapService(ctx *openruntimes.Context, cfg *ExpandConfig, targetCategory string) (*ExpandSummary, error) {
	client := appwrite.NewClient(
		appwrite.WithEndpoint(cfg.Endpoint),
		appwrite.WithProject(cfg.ProjectID),
		appwrite.WithKey(cfg.APIKey),
	)
	db := databases.New(client)
	gemini := NewGeminiExpandClient(cfg.GeminiAPIKey, cfg.AIModel)

	category := targetCategory
	if category == "" {
		category = findThinCategory(ctx, db, cfg.DatabaseID)
	}

	ctx.Log(fmt.Sprintf("Expanding roadmap for category: %s", category))

	// Step 1: Query existing titles in both roadmapTopics and concepts
	existingSet, existingTitles := fetchExistingTitles(db, cfg.DatabaseID, category)
	ctx.Log(fmt.Sprintf("Found %d existing topics in %s", len(existingTitles), category))

	// Step 2: Call Gemini for new topics
	targetCount := cfg.TargetCount
	if targetCount <= 0 {
		targetCount = 30
	}
	suggestions, err := gemini.GenerateTopics(category, existingTitles, targetCount)
	if err != nil {
		return nil, fmt.Errorf("gemini topic generation failed: %w", err)
	}

	summary := &ExpandSummary{
		Category:  category,
		Attempted: len(suggestions),
		NewTopics: []TopicSuggestion{},
	}

	// Step 3: Deduplicate and insert
	now := time.Now().UTC()
	for _, item := range suggestions {
		trimmedTopic := strings.TrimSpace(item.Topic)
		if trimmedTopic == "" {
			summary.Skipped++
			continue
		}

		normalized := NormalizeTitle(trimmedTopic)
		if _, exists := existingSet[normalized]; exists {
			summary.Skipped++
			continue
		}

		// Mark as seen in this run to avoid internal duplicates
		existingSet[normalized] = struct{}{}

		difficulty := NormalizeDifficulty(item.Difficulty)
		topicDoc := RoadmapTopicDoc{
			Topic:      trimmedTopic,
			Category:   category,
			Difficulty: difficulty,
			Priority:   1,
			Status:     "pending",
			Source:     "ai_expanded",
			Attempts:   0,
			CreatedAt:  now,
		}

		_, err := db.CreateDocument(
			cfg.DatabaseID,
			CollectionRoadmapTopics,
			id.Unique(),
			topicDoc,
		)
		if err != nil {
			ctx.Error(fmt.Sprintf("Failed to insert topic '%s': %v", trimmedTopic, err))
			summary.Skipped++
			continue
		}

		summary.Added++
		summary.NewTopics = append(summary.NewTopics, TopicSuggestion{
			Topic:      trimmedTopic,
			Difficulty: difficulty,
		})
	}

	ctx.Log(fmt.Sprintf("Expansion completed for %s: Added %d, Skipped %d",
		category, summary.Added, summary.Skipped))

	return summary, nil
}

// findThinCategory finds the category with the least pending topics.
func findThinCategory(ctx *openruntimes.Context, db *databases.Databases, dbID string) string {
	minCount := 999999
	chosen := Categories[0]

	for _, cat := range Categories {
		list, err := db.ListDocuments(
			dbID,
			CollectionRoadmapTopics,
			db.WithListDocumentsQueries([]string{
				query.Equal("category", cat),
				query.Equal("status", "pending"),
				query.Limit(1),
			}),
		)
		if err == nil {
			if list.Total < minCount {
				minCount = list.Total
				chosen = cat
			}
		}
	}
	return chosen
}

// fetchExistingTitles queries roadmapTopics and concepts collections for existing titles.
func fetchExistingTitles(db *databases.Databases, dbID, category string) (map[string]struct{}, []string) {
	set := make(map[string]struct{})
	var titles []string

	// From roadmapTopics
	if list, err := db.ListDocuments(dbID, CollectionRoadmapTopics,
		db.WithListDocumentsQueries([]string{
			query.Equal("category", category),
			query.Limit(100),
		})); err == nil {
		for _, doc := range list.Documents {
			var r RoadmapTopicDoc
			if doc.Decode(&r) == nil && r.Topic != "" {
				set[NormalizeTitle(r.Topic)] = struct{}{}
				titles = append(titles, r.Topic)
			}
		}
	}

	// From concepts
	if list, err := db.ListDocuments(dbID, CollectionConcepts,
		db.WithListDocumentsQueries([]string{
			query.Equal("category", category),
			query.Limit(100),
		})); err == nil {
		for _, doc := range list.Documents {
			var c struct {
				Title string `json:"title"`
			}
			if doc.Decode(&c) == nil && c.Title != "" {
				set[NormalizeTitle(c.Title)] = struct{}{}
				titles = append(titles, c.Title)
			}
		}
	}

	return set, titles
}
