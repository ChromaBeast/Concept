package handler

import (
	"os"
	"strconv"

	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

// Main is the Open Runtimes entrypoint for runContentPipeline.
func Main(Context openruntimes.Context) openruntimes.Response {
	cfg := loadConfig(Context)
	if cfg.GeminiAPIKey == "" {
		Context.Error("GEMINI_API_KEY environment variable is not configured")
		return Context.Res.Json(map[string]any{"error": "GEMINI_API_KEY missing"}, Context.Res.WithStatusCode(500))
	}
	if cfg.APIKey == "" {
		Context.Error("APPWRITE_API_KEY environment variable is not configured")
		return Context.Res.Json(map[string]any{"error": "APPWRITE_API_KEY missing"}, Context.Res.WithStatusCode(500))
	}

	summary, err := RunPipeline(&Context, cfg)
	if err != nil {
		Context.Error("Pipeline execution failed: " + err.Error())
		return Context.Res.Json(map[string]any{"error": err.Error()}, Context.Res.WithStatusCode(500))
	}

	return Context.Res.Json(summary)
}

// loadConfig reads pipeline configuration from environment and runtime context.
func loadConfig(ctx openruntimes.Context) *PipelineConfig {
	endpoint := getEnvOrDefault("APPWRITE_ENDPOINT", getEnvOrDefault("APPWRITE_FUNCTION_ENDPOINT", "https://cloud.appwrite.io/v1"))
	projectID := getEnvOrDefault("APPWRITE_PROJECT_ID", getEnvOrDefault("APPWRITE_FUNCTION_PROJECT_ID", ""))
	apiKey := getEnvOrDefault("APPWRITE_API_KEY", getEnvOrDefault("APPWRITE_FUNCTION_API_KEY", ""))
	databaseID := getEnvOrDefault("APPWRITE_DATABASE_ID", "concepts_db")
	geminiKey := getEnvOrDefault("GEMINI_API_KEY", getEnvOrDefault("GEMINI_KEY", ""))
	aiModel := getEnvOrDefault("GEMINI_MODEL", getEnvOrDefault("AI_MODEL", "gemini-3.7-flash"))
	validatorModel := getEnvOrDefault("GEMINI_VALIDATOR_MODEL", "gemini-3.5-flash-lite")
	promptVersion := getEnvOrDefault("PROMPT_VERSION", "v1")

	batchSize := 15
	if bStr := os.Getenv("BATCH_SIZE"); bStr != "" {
		if b, err := strconv.Atoi(bStr); err == nil && b > 0 {
			batchSize = b
		}
	}

	concurrency := 3
	if cStr := os.Getenv("CONCURRENCY"); cStr != "" {
		if c, err := strconv.Atoi(cStr); err == nil && c > 0 {
			concurrency = c
		}
	}

	// Check if request body contains overrides
	var bodyOverride struct {
		BatchSize   int `json:"batchSize"`
		Concurrency int `json:"concurrency"`
	}
	if err := ctx.Req.BodyJson(&bodyOverride); err == nil {
		if bodyOverride.BatchSize > 0 {
			batchSize = bodyOverride.BatchSize
		}
		if bodyOverride.Concurrency > 0 {
			concurrency = bodyOverride.Concurrency
		}
	}

	return &PipelineConfig{
		Endpoint:       endpoint,
		ProjectID:      projectID,
		APIKey:         apiKey,
		DatabaseID:     databaseID,
		GeminiAPIKey:   geminiKey,
		BatchSize:      batchSize,
		Concurrency:    concurrency,
		PromptVersion:  promptVersion,
		AIModel:        aiModel,
		ValidatorModel: validatorModel,
	}
}

func getEnvOrDefault(key, def string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return def
}
