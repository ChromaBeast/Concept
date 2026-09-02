package handler

type ActionRequest struct {
	Action   string `json:"action"`   // "pipeline", "expand", "curate", "status"
	Category string `json:"category"` // optional filter for expand/curate
	Batch    int    `json:"batch"`    // optional batch size
}

type PipelineConfig struct {
	Endpoint        string
	ProjectID       string
	APIKey          string
	DatabaseID      string
	GeminiKey       string
	GeminiModel     string
	ValidatorModel  string
	BatchSize       int
	MaxConcurrency  int
	DefaultDuration int
}

type ConceptDraft struct {
	Slug                 string      `json:"slug"`
	Title                string      `json:"title"`
	OneLiner             string      `json:"oneLiner"`
	Category             string      `json:"category"`
	Difficulty           string      `json:"difficulty"`
	Body                 ConceptBody `json:"body"`
	TagNames             []string    `json:"tagNames"`
	EstimatedReadSeconds int         `json:"estimatedReadSeconds"`
	VisualAid            bool        `json:"visualAid"`
	ImagePrompt          string      `json:"imagePrompt,omitempty"`
	AskedByCompanies     []string    `json:"askedByCompanies,omitempty"`
}

type ConceptBody struct {
	Definition     string       `json:"definition"`
	WhyItMatters   string       `json:"whyItMatters"`
	Example        string       `json:"example"`
	CommonPitfall  string       `json:"commonPitfall,omitempty"`
	InterviewAngle string       `json:"interviewAngle,omitempty"`
	QuickChecks    []QuickCheck `json:"quickChecks,omitempty"`
}

type QuickCheck struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

type RoadmapTopicDoc struct {
	ID         string `json:"$id"`
	Topic      string `json:"topic"`
	Category   string `json:"category"`
	Difficulty string `json:"difficulty"`
	Priority   int    `json:"priority"`
	Status     string `json:"status"`
	Source     string `json:"source"`
	Attempts   int    `json:"attempts"`
}

type ValidationResult struct {
	Approved bool
	Reasons  []string
}

type ExpansionResult struct {
	Topics []ExpandedTopic `json:"topics"`
}

type ExpandedTopic struct {
	Topic      string `json:"topic"`
	Category   string `json:"category"`
	Difficulty string `json:"difficulty"`
	Priority   int    `json:"priority"`
}
