package handler

import "time"

// ConceptSummary holds minimal concept data needed for course curation.
type ConceptSummary struct {
	ID                   string `json:"id"`
	Title                string `json:"title"`
	OneLiner             string `json:"oneLiner"`
	EstimatedReadSeconds int    `json:"estimatedReadSeconds"`
	Difficulty           string `json:"difficulty"`
	Category             string `json:"category"`
}

// CuratedCourseDraft represents the structured output from Gemini course curation.
type CuratedCourseDraft struct {
	Title             string   `json:"title"`
	Description       string   `json:"description"`
	OrderedConceptIDs []string `json:"orderedConceptIds"`
}

// CourseDoc represents a document in the courses collection.
type CourseDoc struct {
	ID               string    `json:"$id,omitempty"`
	Slug             string    `json:"slug"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	PrimaryCategory  string    `json:"primaryCategory"`
	Difficulty       string    `json:"difficulty"`
	ConceptIDs       []string  `json:"conceptIds"`
	TotalReadSeconds int       `json:"totalReadSeconds"`
	CoverImageURL    string    `json:"coverImageUrl,omitempty"`
	Status           string    `json:"status"` // published | needs_review
	Source           string    `json:"source"` // ai_curated | human_curated
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
	StartedCount     int       `json:"startedCount"`
	CompletedCount   int       `json:"completedCount"`
}

// CurationResult represents the summary of a single category/difficulty curation attempt.
type CurationResult struct {
	Category      string   `json:"category"`
	Difficulty    string   `json:"difficulty"`
	CourseCreated bool     `json:"courseCreated"`
	CourseID      string   `json:"courseId,omitempty"`
	Title         string   `json:"title,omitempty"`
	ConceptCount  int      `json:"conceptCount,omitempty"`
	Reason        string   `json:"reason,omitempty"`
	ConceptIDs    []string `json:"conceptIds,omitempty"`
}

// CurateConfig holds runtime configuration for curateCourses.
type CurateConfig struct {
	Endpoint     string
	ProjectID    string
	APIKey       string
	DatabaseID   string
	GeminiAPIKey string
	AIModel      string
}
