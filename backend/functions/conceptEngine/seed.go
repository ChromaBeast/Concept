package handler

import (
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/appwrite/sdk-for-go/id"
)

var defaultSeedTopics = []struct {
	topic      string
	category   string
	difficulty string
	priority   int
}{
	{"Binary Search & Variations", "dsa", "beginner", 1},
	{"Two Pointers Technique", "dsa", "beginner", 1},
	{"Sliding Window Pattern", "dsa", "intermediate", 1},
	{"LRU Cache Architecture", "dsa", "intermediate", 1},
	{"Trie (Prefix Tree) Operations", "dsa", "intermediate", 1},
	{"Graph BFS and DFS Traversals", "dsa", "intermediate", 1},
	{"Topological Sort & Cycle Detection", "dsa", "advanced", 1},
	{"CAP Theorem & Trade-offs", "system_design", "beginner", 1},
	{"Consistent Hashing & Ring Distribution", "system_design", "intermediate", 1},
	{"Rate Limiting (Token & Leaky Bucket)", "system_design", "intermediate", 1},
	{"Database Sharding & Partitioning", "system_design", "advanced", 1},
	{"Write-Ahead Logging (WAL)", "system_design", "advanced", 1},
	{"Event-Driven Architecture & Message Queues", "system_design", "intermediate", 1},
	{"ACID vs BASE Properties", "databases", "beginner", 1},
	{"B-Tree vs LSM-Tree Indexing", "databases", "intermediate", 1},
	{"Database Isolation Levels", "databases", "advanced", 1},
	{"TCP 3-Way Handshake & Teardown", "networking", "beginner", 1},
	{"HTTP/2 vs HTTP/3 (QUIC)", "networking", "intermediate", 1},
	{"DNS Resolution & Anycast Routing", "networking", "intermediate", 1},
	{"Process vs Thread Concurrency", "operating_systems", "beginner", 1},
	{"Virtual Memory & Page Fault Handling", "operating_systems", "intermediate", 1},
	{"Epoll vs Select I/O Multiplexing", "operating_systems", "advanced", 1},
	{"Dependency Injection & IoC", "oop_design_patterns", "beginner", 1},
	{"Circuit Breaker Pattern", "oop_design_patterns", "intermediate", 1},
	{"Zero-Downtime Blue-Green Deployment", "devops_infra", "intermediate", 1},
}

func SeedInitialRoadmapTopics(db *databases.Databases, databaseID string) (int, error) {
	inserted := 0
	for _, t := range defaultSeedTopics {
		data := map[string]interface{}{
			"topic":      t.topic,
			"category":   t.category,
			"difficulty": t.difficulty,
			"priority":   t.priority,
			"status":     "pending",
			"source":     "seed",
			"attempts":   0,
		}
		_, err := db.CreateDocument(databaseID, "roadmapTopics", id.Unique(), data)
		if err == nil {
			inserted++
		}
	}
	return inserted, nil
}
