package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/appwrite/sdk-for-go/id"
)

type SeedTopic struct {
	Topic      string    `json:"topic"`
	Category   string    `json:"category"`
	Difficulty string    `json:"difficulty"`
	Priority   int       `json:"priority"`
	Status     string    `json:"status"`
	Source     string    `json:"source"`
	Attempts   int       `json:"attempts"`
	CreatedAt  time.Time `json:"createdAt"`
}

func main() {
	endpoint := getEnv("APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1")
	projectID := getEnv("APPWRITE_PROJECT_ID", "")
	apiKey := getEnv("APPWRITE_API_KEY", "")
	databaseID := getEnv("APPWRITE_DATABASE_ID", "concepts_db")

	if projectID == "" || apiKey == "" {
		fmt.Println("Error: APPWRITE_PROJECT_ID and APPWRITE_API_KEY must be set in the environment.")
		os.Exit(1)
	}

	raw, err := os.ReadFile("seed_roadmap_topics.json")
	if err != nil {
		fmt.Printf("Error reading seed file: %v\n", err)
		os.Exit(1)
	}

	var topics []SeedTopic
	if err := json.Unmarshal(raw, &topics); err != nil {
		fmt.Printf("Error parsing seed JSON: %v\n", err)
		os.Exit(1)
	}

	client := appwrite.NewClient(
		appwrite.WithEndpoint(endpoint),
		appwrite.WithProject(projectID),
		appwrite.WithKey(apiKey),
	)
	db := databases.New(client)

	fmt.Printf("Seeding %d topics into database '%s' (collection: roadmapTopics)...\n", len(topics), databaseID)
	now := time.Now().UTC()
	successCount := 0
	errorCount := 0

	for i, t := range topics {
		t.CreatedAt = now
		t.Attempts = 0

		_, err := db.CreateDocument(
			databaseID,
			"roadmapTopics",
			id.Unique(),
			t,
		)
		if err != nil {
			fmt.Printf("[%d/%d] Failed to insert '%s': %v\n", i+1, len(topics), t.Topic, err)
			errorCount++
		} else {
			successCount++
			if (i+1)%25 == 0 || i+1 == len(topics) {
				fmt.Printf("[%d/%d] Progress: %d inserted successfully\n", i+1, len(topics), successCount)
			}
		}
		// Respect Appwrite rate limits
		time.Sleep(50 * time.Millisecond)
	}

	fmt.Printf("\nSeeding finished! Success: %d, Errors: %d\n", successCount, errorCount)
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
