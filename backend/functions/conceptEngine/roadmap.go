package handler

import (
	"fmt"
	"strings"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/appwrite/sdk-for-go/id"
	"github.com/appwrite/sdk-for-go/query"
)

type RoadmapManager struct {
	db     *databases.Databases
	gemini *GeminiClient
	config PipelineConfig
}

func NewRoadmapManager(cfg PipelineConfig) *RoadmapManager {
	client := appwrite.NewClient(
		appwrite.WithEndpoint(cfg.Endpoint),
		appwrite.WithProject(cfg.ProjectID),
		appwrite.WithKey(cfg.APIKey),
	)
	gemini := NewGeminiClient(cfg.GeminiKey)

	return &RoadmapManager{
		db:     databases.New(client),
		gemini: gemini,
		config: cfg,
	}
}

func (r *RoadmapManager) ExpandCategory(category string) (int, error) {
	if category == "" {
		category = "system_design"
	}

	existingRes, err := r.db.ListDocuments(
		r.config.DatabaseID,
		"roadmapTopics",
		r.db.WithListDocumentsQueries([]string{
			query.Equal("category", category),
			query.Limit(100),
		}),
	)
	if err != nil {
		return 0, fmt.Errorf("failed to fetch existing topics: %w", err)
	}

	var existingTopics []string
	for _, doc := range existingRes.Documents {
		var item RoadmapTopicDoc
		if err := doc.Decode(&item); err == nil && item.Topic != "" {
			existingTopics = append(existingTopics, item.Topic)
		}
	}

	topicsStr := strings.Join(existingTopics, ", ")
	newTopics, err := r.gemini.ExpandTopics(category, topicsStr, r.config.GeminiModel)
	if err != nil {
		return 0, fmt.Errorf("gemini topic expansion failed: %w", err)
	}

	inserted := 0
	for _, t := range newTopics {
		docData := map[string]interface{}{
			"topic":      t.Topic,
			"category":   t.Category,
			"difficulty": t.Difficulty,
			"priority":   t.Priority,
			"status":     "pending",
			"source":     "ai_expanded",
			"attempts":   0,
		}

		_, err := r.db.CreateDocument(
			r.config.DatabaseID,
			"roadmapTopics",
			id.Unique(),
			docData,
		)
		if err == nil {
			inserted++
		}
	}

	return inserted, nil
}
