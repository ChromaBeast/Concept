package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// GeminiCurateClient manages course curation calls to Gemini.
type GeminiCurateClient struct {
	APIKey     string
	Model      string
	HTTPClient *http.Client
}

// NewGeminiCurateClient instantiates a GeminiCurateClient.
func NewGeminiCurateClient(apiKey, model string) *GeminiCurateClient {
	if model == "" {
		model = "gemini-3.8-flash"
	}
	return &GeminiCurateClient{
		APIKey: apiKey,
		Model:  model,
		HTTPClient: &http.Client{
			Timeout: 45 * time.Second,
		},
	}
}

// CurateCourse requests Gemini to assemble a structured course progression from available concepts.
func (g *GeminiCurateClient) CurateCourse(category, difficulty string, concepts []ConceptSummary) (*CuratedCourseDraft, error) {
	conceptListBytes, err := json.Marshal(concepts)
	if err != nil {
		return nil, fmt.Errorf("failed to serialize concepts summary: %w", err)
	}

	prompt := fmt.Sprintf(`Given this list of published concepts in %s / %s (id, title, one-liner):
%s

Pick 8–15 that form a coherent learning progression from foundational to more advanced, in the order a learner should read them.
Return JSON:
{
  "title": "short, engaging course title (e.g., 'System Design Foundations')",
  "description": "1-2 sentences: what this covers and who it's for",
  "orderedConceptIds": ["id1", "id2", ...]
}
Only include IDs from the list provided. Do not invent new IDs.`,
		category, difficulty, string(conceptListBytes))

	schema := map[string]any{
		"type": "OBJECT",
		"properties": map[string]any{
			"title":             map[string]any{"type": "STRING"},
			"description":       map[string]any{"type": "STRING"},
			"orderedConceptIds": map[string]any{"type": "ARRAY", "items": map[string]any{"type": "STRING"}},
		},
		"required": []string{"title", "description", "orderedConceptIds"},
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
			"temperature":      0.4,
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
		return nil, fmt.Errorf("gemini api call failed: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read gemini response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("gemini returned status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var geminiEnvelope struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.Unmarshal(bodyBytes, &geminiEnvelope); err != nil {
		return nil, fmt.Errorf("failed to decode gemini response envelope: %w", err)
	}

	if len(geminiEnvelope.Candidates) == 0 || len(geminiEnvelope.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response candidates from gemini")
	}

	var draft CuratedCourseDraft
	if err := json.Unmarshal([]byte(geminiEnvelope.Candidates[0].Content.Parts[0].Text), &draft); err != nil {
		return nil, fmt.Errorf("failed to parse course draft json: %w", err)
	}

	return &draft, nil
}
