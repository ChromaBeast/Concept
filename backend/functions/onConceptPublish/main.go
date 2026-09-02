package handler

import (
	"encoding/json"
	"os"

	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

// Main is the Open Runtimes entrypoint for onConceptPublish.
func Main(Context openruntimes.Context) openruntimes.Response {
	cfg := loadPublishConfig()
	if cfg.APIKey == "" {
		Context.Error("APPWRITE_API_KEY environment variable is not configured")
		return Context.Res.Json(map[string]any{"error": "APPWRITE_API_KEY missing"}, Context.Res.WithStatusCode(500))
	}

	concept, err := extractConceptEvent(Context)
	if err != nil {
		Context.Error("Failed to extract concept from event data: " + err.Error())
		return Context.Res.Json(map[string]any{"error": err.Error()}, Context.Res.WithStatusCode(400))
	}

	result, err := ProcessConceptPublish(&Context, cfg, concept)
	if err != nil {
		Context.Error("Failed to process publish event: " + err.Error())
		return Context.Res.Json(map[string]any{"error": err.Error()}, Context.Res.WithStatusCode(500))
	}

	return Context.Res.Json(result)
}

// extractConceptEvent parses the concept doc from request body or event environment variable.
func extractConceptEvent(ctx openruntimes.Context) (ConceptEventDoc, error) {
	var doc ConceptEventDoc

	// 1. Check direct request body JSON
	if err := ctx.Req.BodyJson(&doc); err == nil && doc.ID != "" {
		return doc, nil
	}

	// 2. Check APPWRITE_FUNCTION_EVENT_DATA env var
	if eventData := os.Getenv("APPWRITE_FUNCTION_EVENT_DATA"); eventData != "" {
		if err := json.Unmarshal([]byte(eventData), &doc); err == nil && doc.ID != "" {
			return doc, nil
		}
	}

	// 3. Fallback: try raw string body
	if raw := ctx.Req.BodyText(); raw != "" {
		if err := json.Unmarshal([]byte(raw), &doc); err == nil && doc.ID != "" {
			return doc, nil
		}
	}

	return doc, nil
}

func loadPublishConfig() *PublishConfig {
	endpoint := getEnvOrDefault("APPWRITE_ENDPOINT", getEnvOrDefault("APPWRITE_FUNCTION_ENDPOINT", "https://cloud.appwrite.io/v1"))
	projectID := getEnvOrDefault("APPWRITE_PROJECT_ID", getEnvOrDefault("APPWRITE_FUNCTION_PROJECT_ID", ""))
	apiKey := getEnvOrDefault("APPWRITE_API_KEY", getEnvOrDefault("APPWRITE_FUNCTION_API_KEY", ""))
	databaseID := getEnvOrDefault("APPWRITE_DATABASE_ID", "concepts_db")

	return &PublishConfig{
		Endpoint:   endpoint,
		ProjectID:  projectID,
		APIKey:     apiKey,
		DatabaseID: databaseID,
	}
}

func getEnvOrDefault(key, def string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return def
}
