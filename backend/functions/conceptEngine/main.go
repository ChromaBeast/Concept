package handler

import (
	"encoding/json"
	"os"
	"strconv"
	"strings"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

func Main(Context openruntimes.Context) openruntimes.Response {
	req := Context.Req
	res := Context.Res

	cfg := PipelineConfig{
		Endpoint:        getEnv("APPWRITE_ENDPOINT", "https://sgp.cloud.appwrite.io/v1"),
		ProjectID:       getEnv("APPWRITE_PROJECT_ID", "6a97fc420033ed1fefd0"),
		APIKey:          getEnv("APPWRITE_API_KEY", os.Getenv("APPWRITE_FUNCTION_API_KEY")),
		DatabaseID:      getEnv("APPWRITE_DATABASE_ID", "6a97fc7c0037107a5f9a"),
		GeminiKey:       getEnv("GEMINI_API_KEY", ""),
		GeminiModel:     getEnv("GEMINI_MODEL", "gemini-3.7-flash"),
		ValidatorModel:  getEnv("GEMINI_VALIDATOR_MODEL", "gemini-3.5-flash-lite"),
		BatchSize:       5,
		MaxConcurrency:  3,
		DefaultDuration: 90,
	}

	if cfg.GeminiKey == "" {
		return res.Json(map[string]interface{}{
			"success": false,
			"error":   "GEMINI_API_KEY environment variable is missing",
		})
	}

	action := "pipeline"
	category := "system_design"
	batch := cfg.BatchSize

	if qAction, ok := req.Query["action"]; ok && qAction != "" {
		action = strings.ToLower(qAction)
	}
	if qCat, ok := req.Query["category"]; ok && qCat != "" {
		category = qCat
	}
	if qBatch, ok := req.Query["batch"]; ok {
		if b, err := strconv.Atoi(qBatch); err == nil && b > 0 {
			batch = b
		}
	}

	bodyText := req.BodyText()
	if bodyText != "" {
		var bodyReq ActionRequest
		if err := json.Unmarshal([]byte(bodyText), &bodyReq); err == nil {
			if bodyReq.Action != "" {
				action = strings.ToLower(bodyReq.Action)
			}
			if bodyReq.Category != "" {
				category = bodyReq.Category
			}
			if bodyReq.Batch > 0 {
				batch = bodyReq.Batch
			}
		}
	}

	switch action {
	case "seed":
		client := appwrite.NewClient(
			appwrite.WithEndpoint(cfg.Endpoint),
			appwrite.WithProject(cfg.ProjectID),
			appwrite.WithKey(cfg.APIKey),
		)
		db := databases.New(client)
		inserted, _ := SeedInitialRoadmapTopics(db, cfg.DatabaseID)
		return res.Json(map[string]interface{}{
			"success":  true,
			"action":   "seed",
			"inserted": inserted,
		})

	case "expand":
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
			"actions": []string{"pipeline", "expand", "curate", "seed"},
		})
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
