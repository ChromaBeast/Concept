package handler

import (
	"encoding/json"
	"fmt"

	"github.com/appwrite/sdk-for-go/id"
)

func (p *ContentPipeline) GenerateSingleTopic(topicName, category, difficulty string) (string, error) {
	if topicName == "" {
		return "failed", fmt.Errorf("topic name is required")
	}
	if category == "" {
		category = "system_design"
	}
	if difficulty == "" {
		difficulty = "intermediate"
	}

	draft, err := p.gemini.GenerateConcept(topicName, category, difficulty, p.config.GeminiModel)
	if err != nil {
		return "failed", err
	}

	validation := p.validator.Validate(draft)
	status := "published"
	if !validation.Approved {
		status = "needs_review"
	}

	bodyJSON, _ := json.Marshal(draft.Body)
	docData := map[string]interface{}{
		"slug":                 draft.Slug,
		"title":                draft.Title,
		"oneLiner":             draft.OneLiner,
		"category":             draft.Category,
		"difficulty":           draft.Difficulty,
		"body":                 string(bodyJSON),
		"estimatedReadSeconds": draft.EstimatedReadSeconds,
		"status":               status,
		"source":               "ai_generated",
		"aiModel":              p.config.GeminiModel,
		"visualAid":            draft.VisualAid,
		"imagePrompt":          draft.ImagePrompt,
		"needsReviewReasons":   validation.Reasons,
	}

	_, err = p.db.CreateDocument(
		p.config.DatabaseID,
		"concepts",
		id.Unique(),
		docData,
	)
	if err != nil {
		return "failed", err
	}

	return status, nil
}
