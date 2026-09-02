package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// GeminiClient handles API interactions with Google Gemini models.
type GeminiClient struct {
	APIKey         string
	Model          string
	ValidatorModel string
	HTTPClient     *http.Client
}

// NewGeminiClient instantiates a new GeminiClient with cost-effective defaults.
func NewGeminiClient(apiKey, model, validatorModel string) *GeminiClient {
	if model == "" {
		model = "gemini-3.8-flash"
	}
	if validatorModel == "" {
		validatorModel = "gemini-3.8-flash"
	}
	return &GeminiClient{
		APIKey:         apiKey,
		Model:          model,
		ValidatorModel: validatorModel,
		HTTPClient:     &http.Client{Timeout: 45 * time.Second},
	}
}

// GenerateConcept requests structured concept card content for a given topic.
func (g *GeminiClient) GenerateConcept(topic, category, difficulty string) (*GeneratedConceptPayload, error) {
	prompt := fmt.Sprintf(`You are writing one entry for a software engineering reference app.
Topic: %s | Category: %s | Difficulty: %s
Write in plain, direct language. No buzzwords, no hype, no filler. Assume working developer.
Return ONLY valid JSON matching:
- "definition": 1-2 sentences, max 40 words
- "whyItMatters": real-world relevance, max 60 words
- "example": short code snippet or scenario, max 60 words / 12 lines
- "commonPitfall": most common misconception, max 40 words
- "interviewAngle": interview framing question, max 30 words
- "quickChecks": 1-2 items [{"question": "...", "answer": "..."}]
- "suggestedTags": array of tag slugs (e.g. ["distributed-systems", "databases"])
- "visualAid": boolean (true if visual diagram/flow helps, false otherwise)
- "imagePrompt": if visualAid is true, describe ONE simple visual concept for illustration.
Total body words must not exceed 230 words.`, topic, category, difficulty)

	schema := map[string]any{
		"type": "OBJECT",
		"properties": map[string]any{
			"definition":     map[string]any{"type": "STRING"},
			"whyItMatters":   map[string]any{"type": "STRING"},
			"example":        map[string]any{"type": "STRING"},
			"commonPitfall":  map[string]any{"type": "STRING"},
			"interviewAngle": map[string]any{"type": "STRING"},
			"quickChecks": map[string]any{
				"type": "ARRAY",
				"items": map[string]any{
					"type":       "OBJECT",
					"properties": map[string]any{"question": map[string]any{"type": "STRING"}, "answer": map[string]any{"type": "STRING"}},
					"required":   []string{"question", "answer"},
				},
			},
			"suggestedTags": map[string]any{"type": "ARRAY", "items": map[string]any{"type": "STRING"}},
			"visualAid":     map[string]any{"type": "BOOLEAN"},
			"imagePrompt":   map[string]any{"type": "STRING"},
		},
		"required": []string{"definition", "whyItMatters", "example", "commonPitfall", "interviewAngle", "quickChecks", "suggestedTags", "visualAid", "imagePrompt"},
	}

	rawText, err := g.postGenerate(prompt, schema, 0.4)
	if err != nil {
		return nil, err
	}

	var payload GeneratedConceptPayload
	if err := json.Unmarshal([]byte(rawText), &payload); err != nil {
		return nil, fmt.Errorf("failed to unmarshal concept json: %w (raw: %s)", err, rawText)
	}
	return &payload, nil
}

// SelfCheckFactualAccuracy calls Gemini to independently review the technical accuracy of generated content.
func (g *GeminiClient) SelfCheckFactualAccuracy(payloadJSON string) (*SelfCheckResult, error) {
	prompt := fmt.Sprintf(`Review this content for factual accuracy:
%s
Return JSON: { "pass": true|false, "issues": ["..."] }
Fail if any incorrect technical claim, wrong complexity, wrong protocol/algorithm detail, or misleading interview framing. Minor style issues are not a failure reason.`, payloadJSON)

	schema := map[string]any{
		"type": "OBJECT",
		"properties": map[string]any{
			"pass":   map[string]any{"type": "BOOLEAN"},
			"issues": map[string]any{"type": "ARRAY", "items": map[string]any{"type": "STRING"}},
		},
		"required": []string{"pass", "issues"},
	}

	rawText, err := g.postGenerateModel(g.ValidatorModel, prompt, schema, 0.1)
	if err != nil {
		return nil, err
	}

	var res SelfCheckResult
	if err := json.Unmarshal([]byte(rawText), &res); err != nil {
		return nil, fmt.Errorf("failed to parse self-check result: %w", err)
	}
	return &res, nil
}

func (g *GeminiClient) postGenerate(prompt string, schema map[string]any, temp float64) (string, error) {
	return g.postGenerateModel(g.Model, prompt, schema, temp)
}

func (g *GeminiClient) postGenerateModel(model, prompt string, schema map[string]any, temp float64) (string, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent", model)
	reqBody := map[string]any{
		"contents":         []any{map[string]any{"parts": []any{map[string]any{"text": prompt}}}},
		"generationConfig": map[string]any{"responseMimeType": "application/json", "responseSchema": schema, "temperature": temp},
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-goog-api-key", g.APIKey)

	resp, err := g.HTTPClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("gemini api http error: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("gemini read response error: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("gemini api returned status %d: %s", resp.StatusCode, string(bodyBytes))
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
		return "", fmt.Errorf("failed to decode gemini response: %w", err)
	}
	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("empty response candidates from gemini")
	}
	return geminiResp.Candidates[0].Content.Parts[0].Text, nil
}
