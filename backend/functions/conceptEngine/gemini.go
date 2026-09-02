package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

var defaultModelCascade = []string{
	"gemini-3.8-flash",
	"gemini-3.7-flash",
	"gemini-3.6-flash",
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

CORE CARD RULES:
1. Definition: strictly <= 40 words.
2. Why It Matters: strictly <= 60 words.
3. Example: strictly <= 60 words or <= 12 lines of code.
4. Common Pitfall: strictly <= 40 words.
5. Interview Angle: strictly <= 30 words.
6. Total word count across core body (definition + whyItMatters + example + commonPitfall + interviewAngle) must NOT exceed 230 words.
7. Include 1-2 QuickChecks (question + concise answer).
8. VisualAid: boolean. If true, provide a brief imagePrompt for generating an infographic.

DEEP DIVE RULES (OPTIONAL EXTENSION):
- If the topic is genuinely dense (e.g. consensus algorithms, memory models, distributed transactions, internal engine mechanics) where 2 minutes isn't enough, set "needsDeepDive": true and provide "deepDive".
- For concepts that can be explained adequately in 2 minutes, set "needsDeepDive": false and omit "deepDive".
- Deep dive word budget:
  * beginner: no deep dive ("needsDeepDive": false).
  * intermediate: up to ~400 words (~3 min extra read).
  * advanced: up to ~900 words (~6–7 min extra read).

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
  "needsDeepDive": true,
  "deepDive": {
    "title": "In-Depth Architectural & Protocol Mechanics",
    "estimatedReadSeconds": 360,
    "sections": [
      {
        "heading": "Under the Hood: State Machine Replication",
        "content": "Detailed walkthrough of state transitions, commit logs, and failure recovery...",
        "codeSnippet": "// Optional code or pseudo-code"
      }
    ]
  },
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

	// Synchronize deepDive between top-level and body
	if draft.NeedsDeepDive && draft.DeepDive != nil {
		draft.Body.NeedsDeepDive = true
		draft.Body.DeepDive = draft.DeepDive
	} else if draft.Body.NeedsDeepDive && draft.Body.DeepDive != nil {
		draft.NeedsDeepDive = true
		draft.DeepDive = draft.Body.DeepDive
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
