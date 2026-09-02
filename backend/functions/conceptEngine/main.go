package handler

import (
	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

func Main(Context openruntimes.Context) openruntimes.Response {
	req := Context.Req
	res := Context.Res

	cfg := BuildPipelineConfig(req)
	action, category, topic, difficulty, batch := ParseRequestParams(req, cfg.BatchSize)

	switch action {
	case "status":
		return res.Json(map[string]interface{}{
			"success": true,
			"service": "Concept Unified Engine",
			"runtime": "go-1.26",
			"actions": []string{"pipeline", "generate", "expand", "curate", "seed", "status"},
		})

	case "generate":
		if cfg.GeminiKey == "" {
			return res.Json(map[string]interface{}{
				"success": false,
				"error":   "GEMINI_API_KEY is not configured",
			})
		}
		if topic == "" {
			return res.Json(map[string]interface{}{
				"success": false,
				"error":   "topic is required for generate action",
			})
		}
		pipeline := NewContentPipeline(cfg)
		pubStatus, err := pipeline.GenerateSingleTopic(topic, category, difficulty)
		if err != nil {
			return res.Json(map[string]interface{}{
				"success": false,
				"action":  "generate",
				"error":   err.Error(),
			})
		}
		return res.Json(map[string]interface{}{
			"success": true,
			"action":  "generate",
			"topic":   topic,
			"status":  pubStatus,
		})

	case "seed":
		client := appwrite.NewClient(
			appwrite.WithEndpoint(cfg.Endpoint),
			appwrite.WithProject(cfg.ProjectID),
			appwrite.WithKey(cfg.APIKey),
		)
		db := databases.New(client)
		inserted, err := SeedInitialRoadmapTopics(db, cfg.DatabaseID)
		if err != nil {
			return res.Json(map[string]interface{}{
				"success": false,
				"action":  "seed",
				"error":   err.Error(),
			})
		}
		return res.Json(map[string]interface{}{
			"success":  true,
			"action":   "seed",
			"inserted": inserted,
		})

	case "expand":
		if cfg.GeminiKey == "" {
			return res.Json(map[string]interface{}{
				"success": false,
				"error":   "GEMINI_API_KEY is not configured",
			})
		}
		rm := NewRoadmapManager(cfg)
		inserted, err := rm.ExpandCategory(category)
		if err != nil {
			return res.Json(map[string]interface{}{
				"success": false,
				"action":  "expand",
				"error":   err.Error(),
			})
		}
		return res.Json(map[string]interface{}{
			"success":  true,
			"action":   "expand",
			"category": category,
			"inserted": inserted,
		})

	case "pipeline":
		if cfg.GeminiKey == "" {
			return res.Json(map[string]interface{}{
				"success": false,
				"error":   "GEMINI_API_KEY is not configured",
			})
		}
		pipeline := NewContentPipeline(cfg)
		pub, rev, err := pipeline.RunBatch(batch)
		if err != nil {
			return res.Json(map[string]interface{}{
				"success": false,
				"action":  "pipeline",
				"error":   err.Error(),
			})
		}
		return res.Json(map[string]interface{}{
			"success":   true,
			"action":    "pipeline",
			"published": pub,
			"reviewed":  rev,
		})

	default:
		return res.Json(map[string]interface{}{
			"success": true,
			"service": "Concept Unified Engine",
			"runtime": "go-1.26",
			"actions": []string{"pipeline", "generate", "expand", "curate", "seed", "status"},
		})
	}
}
