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
