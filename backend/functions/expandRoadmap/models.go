package handler

import "time"

// TopicSuggestion represents an AI-generated topic proposal.
type TopicSuggestion struct {
	Topic      string `json:"topic"`
	Difficulty string `json:"difficulty"` // beginner | intermediate | advanced
}

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

// ExpandSummary represents the execution result of the roadmap expansion.
type ExpandSummary struct {
	Category  string            `json:"category"`
	Attempted int               `json:"attempted"`
	Added     int               `json:"added"`
	Skipped   int               `json:"skipped"`
	NewTopics []TopicSuggestion `json:"newTopics"`
}

// ExpandConfig holds execution configuration for expandRoadmap.
type ExpandConfig struct {
	Endpoint     string
	ProjectID    string
	APIKey       string
	DatabaseID   string
	GeminiAPIKey string
	AIModel      string
	TargetCount  int
}
