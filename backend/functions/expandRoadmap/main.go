package handler

import (
	"os"
	"strconv"

	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

// Main is the Open Runtimes entrypoint for expandRoadmap.
func Main(Context openruntimes.Context) openruntimes.Response {
	cfg := loadExpandConfig()
	if cfg.GeminiAPIKey == "" {
		Context.Error("GEMINI_API_KEY environment variable is not configured")
		return Context.Res.Json(map[string]any{"error": "GEMINI_API_KEY missing"}, Context.Res.WithStatusCode(500))
	}
	if cfg.APIKey == "" {
		Context.Error("APPWRITE_API_KEY environment variable is not configured")
		return Context.Res.Json(map[string]any{"error": "APPWRITE_API_KEY missing"}, Context.Res.WithStatusCode(500))
	}

	var targetCategory string
	var reqBody struct {
		Category    string `json:"category"`
		TargetCount int    `json:"targetCount"`
	}
	if err := Context.Req.BodyJson(&reqBody); err == nil {
		targetCategory = reqBody.Category
		if reqBody.TargetCount > 0 {
			cfg.TargetCount = reqBody.TargetCount
		}
	}

	summary, err := ExpandRoadmapService(&Context, cfg, targetCategory)
	if err != nil {
		Context.Error("Roadmap expansion failed: " + err.Error())
		return Context.Res.Json(map[string]any{"error": err.Error()}, Context.Res.WithStatusCode(500))
	}

	return Context.Res.Json(summary)
}

func loadExpandConfig() *ExpandConfig {
	endpoint := getEnvOrDefault("APPWRITE_ENDPOINT", getEnvOrDefault("APPWRITE_FUNCTION_ENDPOINT", "https://cloud.appwrite.io/v1"))
	projectID := getEnvOrDefault("APPWRITE_PROJECT_ID", getEnvOrDefault("APPWRITE_FUNCTION_PROJECT_ID", ""))
	apiKey := getEnvOrDefault("APPWRITE_API_KEY", getEnvOrDefault("APPWRITE_FUNCTION_API_KEY", ""))
	databaseID := getEnvOrDefault("APPWRITE_DATABASE_ID", "concepts_db")
	geminiKey := getEnvOrDefault("GEMINI_API_KEY", getEnvOrDefault("GEMINI_KEY", ""))
	aiModel := getEnvOrDefault("GEMINI_MODEL", getEnvOrDefault("AI_MODEL", "gemini-3.8-flash"))

	targetCount := 30
	if tcStr := os.Getenv("TARGET_COUNT"); tcStr != "" {
		if tc, err := strconv.Atoi(tcStr); err == nil && tc > 0 {
			targetCount = tc
		}
	}

	return &ExpandConfig{
		Endpoint:     endpoint,
		ProjectID:    projectID,
		APIKey:       apiKey,
		DatabaseID:   databaseID,
		GeminiAPIKey: geminiKey,
		AIModel:      aiModel,
		TargetCount:  targetCount,
	}
}

func getEnvOrDefault(key, def string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return def
}
