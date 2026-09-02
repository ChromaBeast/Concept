package handler

import (
	"fmt"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/appwrite/sdk-for-go/id"
	"github.com/appwrite/sdk-for-go/query"
)

type CourseCurator struct {
	db     *databases.Databases
	gemini *GeminiClient
	config PipelineConfig
}

func NewCourseCurator(cfg PipelineConfig) *CourseCurator {
	client := appwrite.NewClient(
		appwrite.WithEndpoint(cfg.Endpoint),
		appwrite.WithProject(cfg.ProjectID),
		appwrite.WithKey(cfg.APIKey),
	)
	gemini := NewGeminiClient(cfg.GeminiKey)

	return &CourseCurator{
		db:     databases.New(client),
		gemini: gemini,
		config: cfg,
	}
}

func (c *CourseCurator) CurateCategoryCourses(category string) (int, error) {
	if category == "" {
		category = "system_design"
	}

	conceptsRes, err := c.db.ListDocuments(
		c.config.DatabaseID,
		"concepts",
		c.db.WithListDocumentsQueries([]string{
			query.Equal("category", category),
			query.Equal("status", "published"),
			query.Limit(50),
		}),
	)
	if err != nil {
		return 0, fmt.Errorf("failed to fetch published concepts: %w", err)
	}

	if len(conceptsRes.Documents) < 4 {
		return 0, nil
	}

	var conceptIDs []string
	totalSecs := 0
	for _, doc := range conceptsRes.Documents {
		conceptIDs = append(conceptIDs, doc.Id)
		var m map[string]interface{}
		if err := doc.Decode(&m); err == nil {
			if secs, ok := m["estimatedReadSeconds"].(float64); ok {
				totalSecs += int(secs)
			}
		}
	}

	courseData := map[string]interface{}{
		"slug":             fmt.Sprintf("%s-mastery", category),
		"title":            fmt.Sprintf("%s Core Mastery", category),
		"description":      fmt.Sprintf("Curated learning progression through %d essential %s concepts.", len(conceptIDs), category),
		"primaryCategory":  category,
		"difficulty":       "intermediate",
		"conceptIds":       conceptIDs,
		"totalReadSeconds": totalSecs,
		"status":           "published",
		"source":           "ai_curated",
		"startedCount":     0,
		"completedCount":   0,
	}

	_, err = c.db.CreateDocument(
		c.config.DatabaseID,
		"courses",
		id.Unique(),
		courseData,
	)
	if err != nil {
		return 0, err
	}

	return 1, nil
}
