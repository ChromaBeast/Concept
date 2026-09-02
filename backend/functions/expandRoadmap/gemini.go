package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// GeminiExpandClient handles requests to Gemini for generating new roadmap topics.
type GeminiExpandClient struct {
	APIKey     string
	Model      string
	HTTPClient *http.Client
}

// NewGeminiExpandClient instantiates a GeminiExpandClient.
func NewGeminiExpandClient(apiKey, model string) *GeminiExpandClient {
	if model == "" {
		model = "gemini-3.8-flash"
	}
	return &GeminiExpandClient{
		APIKey: apiKey,
		Model:  model,
		HTTPClient: &http.Client{
			Timeout: 45 * time.Second,
		},
	}
}

// GenerateTopics asks Gemini for 30 essential concepts in a category avoiding existing ones.
func (g *GeminiExpandClient) GenerateTopics(category string, existingTitles []string, count int) ([]TopicSuggestion, error) {
	if count <= 0 {
		count = 30
	}

	existingStr := strings.Join(existingTitles, ", ")
	if len(existingStr) > 4000 {
		existingStr = existingStr[:4000] + "..."
	}

	prompt := fmt.Sprintf(`List %d essential software engineering concepts in the category "%s" that a working developer would realistically encounter on the job or be asked about in an interview.
Do not repeat any of these existing topics: %s.

Return ONLY a JSON array of objects with "topic" and "difficulty" (one of "beginner", "intermediate", "advanced").`,
		count, category, existingStr)

	schema := map[string]any{
		"type": "ARRAY",
		"items": map[string]any{
			"type": "OBJECT",
			"properties": map[string]any{
				"topic":      map[string]any{"type": "STRING"},
				"difficulty": map[string]any{"type": "STRING"},
			},
			"required": []string{"topic", "difficulty"},
		},
	}

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent", g.Model)

	reqBody := map[string]any{
		"contents": []any{
			map[string]any{
				"parts": []any{map[string]any{"text": prompt}},
			},
		},
		"generationConfig": map[string]any{
			"responseMimeType": "application/json",
			"responseSchema":   schema,
			"temperature":      0.5,
		},
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-goog-api-key", g.APIKey)

	resp, err := g.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("gemini request error: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read gemini response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("gemini api returned status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var geminiResp struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.Unmarshal(bodyBytes, &geminiResp); err != nil {
		return nil, fmt.Errorf("failed to decode gemini envelope: %w", err)
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty candidates returned from gemini")
	}

	var suggestions []TopicSuggestion
	if err := json.Unmarshal([]byte(geminiResp.Candidates[0].Content.Parts[0].Text), &suggestions); err != nil {
		return nil, fmt.Errorf("failed to unmarshal topic suggestions: %w", err)
	}

	return suggestions, nil
}
