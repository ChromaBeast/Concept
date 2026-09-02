package handler

import (
	"os"

	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

// Main is the Open Runtimes entrypoint for curateCourses.
func Main(Context openruntimes.Context) openruntimes.Response {
	cfg := loadCurateConfig()
	if cfg.GeminiAPIKey == "" {
		Context.Error("GEMINI_API_KEY environment variable is not configured")
		return Context.Res.Json(map[string]any{"error": "GEMINI_API_KEY missing"}, Context.Res.WithStatusCode(500))
	}
	if cfg.APIKey == "" {
		Context.Error("APPWRITE_API_KEY environment variable is not configured")
		return Context.Res.Json(map[string]any{"error": "APPWRITE_API_KEY missing"}, Context.Res.WithStatusCode(500))
	}

	var targetCategory, targetDifficulty string
	var reqBody struct {
		Category   string `json:"category"`
		Difficulty string `json:"difficulty"`
	}
	if err := Context.Req.BodyJson(&reqBody); err == nil {
		targetCategory = reqBody.Category
		targetDifficulty = reqBody.Difficulty
	}

	results, err := CurateCoursesService(&Context, cfg, targetCategory, targetDifficulty)
	if err != nil {
		Context.Error("Course curation execution failed: " + err.Error())
		return Context.Res.Json(map[string]any{"error": err.Error()}, Context.Res.WithStatusCode(500))
	}

	return Context.Res.Json(map[string]any{
		"status":  "completed",
		"results": results,
	})
}

func loadCurateConfig() *CurateConfig {
	endpoint := getEnvOrDefault("APPWRITE_ENDPOINT", getEnvOrDefault("APPWRITE_FUNCTION_ENDPOINT", "https://cloud.appwrite.io/v1"))
	projectID := getEnvOrDefault("APPWRITE_PROJECT_ID", getEnvOrDefault("APPWRITE_FUNCTION_PROJECT_ID", ""))
	apiKey := getEnvOrDefault("APPWRITE_API_KEY", getEnvOrDefault("APPWRITE_FUNCTION_API_KEY", ""))
	databaseID := getEnvOrDefault("APPWRITE_DATABASE_ID", "concepts_db")
	geminiKey := getEnvOrDefault("GEMINI_API_KEY", getEnvOrDefault("GEMINI_KEY", ""))
	aiModel := getEnvOrDefault("GEMINI_MODEL", getEnvOrDefault("AI_MODEL", "gemini-3.7-flash"))

	return &CurateConfig{
		Endpoint:     endpoint,
		ProjectID:    projectID,
		APIKey:       apiKey,
		DatabaseID:   databaseID,
		GeminiAPIKey: geminiKey,
		AIModel:      aiModel,
	}
}

func getEnvOrDefault(key, def string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return def
}
