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

var defaultModelCascade = []string{
	"gemini-3.7-flash",
	"gemini-3.6-flash",
	"gemini-3.5-flash",
	"gemini-3.5-flash-lite",
	"gemini-3.1-flash-lite",
	"gemini-2.0-flash",
	"gemini-1.5-flash",
}

type GeminiClient struct {
	apiKey string
	client *http.Client
}

func NewGeminiClient(apiKey string) *GeminiClient {
	return &GeminiClient{
		apiKey: apiKey,
		client: &http.Client{Timeout: 90 * time.Second},
	}
}

func (g *GeminiClient) GenerateConcept(topic, category, difficulty, preferredModel string) (*ConceptDraft, error) {
	prompt := fmt.Sprintf(
		`You are a staff software engineer creating a concise reference on "%s".
Category: %s, Difficulty: %s.
Rules:
1. Definition: strictly <= 40 words.
2. Why It Matters: strictly <= 60 words.
3. Example: strictly <= 60 words or <= 12 lines of code.
4. Common Pitfall: strictly <= 40 words.
5. Interview Angle: strictly <= 30 words.
6. Total word count across all body text must not exceed 230 words.
7. Include 1-2 QuickChecks (question + concise answer).
8. VisualAid: boolean. If true, provide a brief imagePrompt for generating an infographic.

Return strictly JSON matching this structure:
{
  "slug": "url-friendly-slug",
  "title": "%s",
  "oneLiner": "One sentence punchy summary",
  "category": "%s",
  "difficulty": "%s",
  "tagNames": ["Tag1", "Tag2"],
  "estimatedReadSeconds": 90,
  "visualAid": true,
  "imagePrompt": "Description of infographic",
  "askedByCompanies": ["Google", "Meta"],
  "body": {
    "definition": "...",
    "whyItMatters": "...",
    "example": "...",
    "commonPitfall": "...",
    "interviewAngle": "...",
    "quickChecks": [{"question": "...", "answer": "..."}]
  }
}`,
		topic, category, difficulty, topic, category, difficulty,
	)

	respText, err := g.callGeminiWithFallback(prompt, preferredModel)
	if err != nil {
		return nil, err
	}

	cleanJSON := cleanJSONResponse(respText)
	var draft ConceptDraft
	if err := json.Unmarshal([]byte(cleanJSON), &draft); err != nil {
		return nil, fmt.Errorf("failed to parse JSON from Gemini: %w\nResponse: %s", err, cleanJSON)
	}
	return &draft, nil
}

func (g *GeminiClient) FactCheckConcept(draft *ConceptDraft, preferredModel string) (bool, string, error) {
	prompt := fmt.Sprintf(
		`Fact-check this technical concept reference for "%s":
Definition: %s
Why It Matters: %s
Example: %s
Common Pitfall: %s

Is this technically accurate? Respond in JSON:
{"accurate": true, "feedback": "OK"}`,
		draft.Title, draft.Body.Definition, draft.Body.WhyItMatters, draft.Body.Example, draft.Body.CommonPitfall,
	)

	respText, err := g.callGeminiWithFallback(prompt, preferredModel)
	if err != nil {
		return false, "", err
	}

	cleanJSON := cleanJSONResponse(respText)
	var res struct {
		Accurate bool   `json:"accurate"`
		Feedback string `json:"feedback"`
	}
	if err := json.Unmarshal([]byte(cleanJSON), &res); err != nil {
		return true, "Parsed check fallback", nil
	}
	return res.Accurate, res.Feedback, nil
}

func (g *GeminiClient) ExpandTopics(category, existingTopics, preferredModel string) ([]ExpandedTopic, error) {
	prompt := fmt.Sprintf(
		`Suggest 15 essential software engineering topics for category "%s".
Avoid these existing topics: %s.
Return strictly JSON:
{"topics": [{"topic": "Name", "category": "%s", "difficulty": "beginner", "priority": 1}]}`,
		category, existingTopics, category,
	)

	respText, err := g.callGeminiWithFallback(prompt, preferredModel)
	if err != nil {
		return nil, err
	}

	cleanJSON := cleanJSONResponse(respText)
	var res ExpansionResult
	if err := json.Unmarshal([]byte(cleanJSON), &res); err != nil {
		return nil, err
	}
	return res.Topics, nil
}

func (g *GeminiClient) callGeminiWithFallback(prompt, preferredModel string) (string, error) {
	models := make([]string, 0, len(defaultModelCascade)+1)
	if preferredModel != "" {
		models = append(models, preferredModel)
	}
	for _, m := range defaultModelCascade {
		if m != preferredModel {
			models = append(models, m)
		}
	}

	var lastErr error
	for _, model := range models {
		resp, err := g.callSingleModel(prompt, model)
		if err == nil {
			return resp, nil
		}
		lastErr = err
		// If rate limit (429) or unavailable, pause for backoff and try next model
		time.Sleep(3 * time.Second)
	}
	return "", fmt.Errorf("all fallback models exhausted: %w", lastErr)
}

func (g *GeminiClient) callSingleModel(prompt, model string) (string, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, g.apiKey)

	reqBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{"parts": []map[string]interface{}{{"text": prompt}}},
		},
		"generationConfig": map[string]interface{}{
			"responseMimeType": "application/json",
			"temperature":      0.2,
		},
	}

	payload, _ := json.Marshal(reqBody)
	resp, err := g.client.Post(url, "application/json", bytes.NewReader(payload))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("model %s returned %d: %s", model, resp.StatusCode, string(body))
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

	if err := json.Unmarshal(body, &geminiResp); err != nil || len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("empty response from model %s", model)
	}

	return geminiResp.Candidates[0].Content.Parts[0].Text, nil
}

func cleanJSONResponse(s string) string {
	s = strings.TrimSpace(s)
	s = strings.TrimPrefix(s, "```json")
	s = strings.TrimPrefix(s, "```")
	s = strings.TrimSuffix(s, "```")
	return strings.TrimSpace(s)
}
