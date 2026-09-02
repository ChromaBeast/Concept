package handler

// ConceptEventDoc represents the incoming concept document from the database event.
type ConceptEventDoc struct {
	ID        string   `json:"$id"`
	Title     string   `json:"title"`
	Slug      string   `json:"slug"`
	Category  string   `json:"category"`
	TagIDs    []string `json:"tagIds"`
	Status    string   `json:"status"`
	VisualAid bool     `json:"visualAid"`
}

// TagDoc represents a record in the tags collection.
type TagDoc struct {
	ID         string `json:"$id,omitempty"`
	Name       string `json:"name"`
	Slug       string `json:"slug"`
	UsageCount int    `json:"usageCount"`
	Category   string `json:"category"`
}

// PublishSyncResult summarizes the tag and counter updates.
type PublishSyncResult struct {
	ConceptID    string   `json:"conceptId"`
	Status       string   `json:"status"`
	Category     string   `json:"category"`
	UpdatedTags  []string `json:"updatedTags"`
	CreatedTags  []string `json:"createdTags"`
	SkippedCount int      `json:"skippedCount"`
}

// PublishConfig holds configuration for the event handler.
type PublishConfig struct {
	Endpoint   string
	ProjectID  string
	APIKey     string
	DatabaseID string
}
