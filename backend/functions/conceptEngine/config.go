package handler

import (
	"encoding/json"
	"os"
	"strconv"
	"strings"

	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

func BuildPipelineConfig(req openruntimes.ContextRequest) PipelineConfig {
	apiKey := req.Headers["x-appwrite-key"]
	if apiKey == "" {
		apiKey = getEnv("APPWRITE_API_KEY", os.Getenv("APPWRITE_FUNCTION_API_KEY"))
	}

	return PipelineConfig{
		Endpoint:        getEnv("APPWRITE_ENDPOINT", "https://sgp.cloud.appwrite.io/v1"),
		ProjectID:       getEnv("APPWRITE_PROJECT_ID", "6a97fc420033ed1fefd0"),
		APIKey:          apiKey,
		DatabaseID:      getEnv("APPWRITE_DATABASE_ID", "6a97fc7c0037107a5f9a"),
		GeminiKey:       getEnv("GEMINI_API_KEY", ""),
		GeminiModel:     getEnv("GEMINI_MODEL", "gemini-3.8-flash"),
		ValidatorModel:  getEnv("GEMINI_VALIDATOR_MODEL", "gemini-3.8-flash"),
		BatchSize:       5,
		MaxConcurrency:  3,
		DefaultDuration: 90,
	}
}

func ParseRequestParams(req openruntimes.ContextRequest, defaultBatch int) (string, string, string, string, int) {
	action := "pipeline"
	category := "system_design"
	topic := ""
	difficulty := "intermediate"
	batch := defaultBatch

	if qAction, ok := req.Query["action"]; ok && qAction != "" {
		action = strings.ToLower(qAction)
	}
	if qCat, ok := req.Query["category"]; ok && qCat != "" {
		category = qCat
	}
	if qTopic, ok := req.Query["topic"]; ok && qTopic != "" {
		topic = qTopic
	}
	if qDiff, ok := req.Query["difficulty"]; ok && qDiff != "" {
		difficulty = qDiff
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
			if bodyReq.Topic != "" {
				topic = bodyReq.Topic
			}
			if bodyReq.Difficulty != "" {
				difficulty = bodyReq.Difficulty
			}
			if bodyReq.Batch > 0 {
				batch = bodyReq.Batch
			}
		}
	}

	return action, category, topic, difficulty, batch
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
