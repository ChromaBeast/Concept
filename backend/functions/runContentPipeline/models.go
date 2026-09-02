package handler

import "time"

// RoadmapTopicDoc represents a document in the roadmapTopics collection.
type RoadmapTopicDoc struct {
	ID         string    `json:"$id,omitempty"`
	Topic      string    `json:"topic"`
	Category   string    `json:"category"`
	Difficulty string    `json:"difficulty"`
	Priority   int       `json:"priority"`
	Status     string    `json:"status"` // pending | claimed | done | failed
	Source     string    `json:"source"` // seed | ai_expanded
	Attempts   int       `json:"attempts"`
	CreatedAt  time.Time `json:"createdAt"`
}

// QuickCheck represents a recall question and its answer.
type QuickCheck struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

// ConceptBody holds the structured text of a concept card.
type ConceptBody struct {
	Definition     string       `json:"definition"`
	WhyItMatters   string       `json:"whyItMatters"`
	Example        string       `json:"example"`
	CommonPitfall  string       `json:"commonPitfall,omitempty"`
	InterviewAngle string       `json:"interviewAngle,omitempty"`
	QuickChecks    []QuickCheck `json:"quickChecks"`
}

// GeneratedConceptPayload is the structured output from Gemini generation.
type GeneratedConceptPayload struct {
	Definition     string       `json:"definition"`
	WhyItMatters   string       `json:"whyItMatters"`
	Example        string       `json:"example"`
	CommonPitfall  string       `json:"commonPitfall"`
	InterviewAngle string       `json:"interviewAngle"`
	QuickChecks    []QuickCheck `json:"quickChecks"`
	SuggestedTags  []string     `json:"suggestedTags"`
	VisualAid      bool         `json:"visualAid"`
	ImagePrompt    string       `json:"imagePrompt"`
}

// ConceptDoc represents the full concept document stored in the concepts collection.
type ConceptDoc struct {
	ID                   string      `json:"$id,omitempty"`
	Slug                 string      `json:"slug"`
	Title                string      `json:"title"`
	OneLiner             string      `json:"oneLiner"`
	Category             string      `json:"category"`
	TagIDs               []string    `json:"tagIds"`
	Difficulty           string      `json:"difficulty"`
	Body                 string      `json:"body"` // JSON serialized ConceptBody
	EstimatedReadSeconds int         `json:"estimatedReadSeconds"`
	Status               string      `json:"status"` // published | needs_review
	Source               string      `json:"source"` // ai_generated
	AIModel              string      `json:"aiModel"`
	PromptVersion        string      `json:"promptVersion"`
	RelatedConceptIDs    []string    `json:"relatedConceptIds"`
	AskedByCompanies     []string    `json:"askedByCompanies"`
	CreatedAt            string      `json:"createdAt"`
	UpdatedAt            string      `json:"updatedAt"`
	ViewCount            int         `json:"viewCount"`
	BookmarkCount        int         `json:"bookmarkCount"`
	VisualAid            bool        `json:"visualAid"`
	HeroImageURL         string      `json:"heroImageUrl,omitempty"`
	ImagePrompt          string      `json:"imagePrompt,omitempty"`
	NeedsReviewReasons   []string    `json:"needsReviewReasons,omitempty"`
}

// PipelineRunDoc represents the summary doc saved to pipelineRuns collection.
type PipelineRunDoc struct {
	StartedAt   string   `json:"startedAt"`
	FinishedAt  string   `json:"finishedAt"`
	Attempted   int      `json:"attempted"`
	Published   int      `json:"published"`
	NeedsReview int      `json:"needsReview"`
	Failed      int      `json:"failed"`
	Errors      []string `json:"errors"`
}

// ValidationResult represents automated approval results.
type ValidationResult struct {
	Passed    bool     `json:"passed"`
	Reasons   []string `json:"reasons"`
	WordCount int      `json:"wordCount"`
}

// SelfCheckResult represents the response from the factual self-check Gemini call.
type SelfCheckResult struct {
	Pass   bool     `json:"pass"`
	Issues []string `json:"issues"`
}

// PipelineConfig holds configuration and clients for the pipeline run.
type PipelineConfig struct {
	Endpoint      string
	ProjectID     string
	APIKey        string
	DatabaseID    string
	GeminiAPIKey  string
	BatchSize     int
	Concurrency   int
	PromptVersion  string
	AIModel        string
	ValidatorModel string
}
