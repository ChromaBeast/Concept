package handler

import (
	"fmt"
	"time"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/appwrite/sdk-for-go/id"
	"github.com/appwrite/sdk-for-go/query"
	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

const (
	CollectionConcepts = "concepts"
	CollectionCourses  = "courses"
	MinConceptThreshold = 8
	MinCourseSize       = 6
	MaxCourseSize       = 20
	OverlapThreshold    = 0.70
)

// CurateCoursesService executes the course curation process across categories.
func CurateCoursesService(ctx *openruntimes.Context, cfg *CurateConfig, targetCat, targetDiff string) ([]CurationResult, error) {
	client := appwrite.NewClient(
		appwrite.WithEndpoint(cfg.Endpoint),
		appwrite.WithProject(cfg.ProjectID),
		appwrite.WithKey(cfg.APIKey),
	)
	db := databases.New(client)
	gemini := NewGeminiCurateClient(cfg.GeminiAPIKey, cfg.AIModel)

	conceptsByGroup, conceptLookup, err := fetchPublishedConcepts(db, cfg.DatabaseID, targetCat, targetDiff)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch published concepts: %w", err)
	}

	var results []CurationResult
	for groupKey, concepts := range conceptsByGroup {
		category, difficulty := groupKey.Category, groupKey.Difficulty
		if len(concepts) < MinConceptThreshold {
			results = append(results, CurationResult{
				Category:   category,
				Difficulty: difficulty,
				Reason:     fmt.Sprintf("Insufficient published concepts (%d < %d)", len(concepts), MinConceptThreshold),
			})
			continue
		}

		ctx.Log(fmt.Sprintf("Curating course for %s / %s with %d available concepts", category, difficulty, len(concepts)))

		existingCourseIDs := fetchExistingCourseConceptIDs(db, cfg.DatabaseID, category)
		draft, err := gemini.CurateCourse(category, difficulty, concepts)
		if err != nil {
			results = append(results, CurationResult{
				Category:   category,
				Difficulty: difficulty,
				Reason:     fmt.Sprintf("Gemini curation error: %v", err),
			})
			continue
		}

		// Validate & strip invalid IDs
		var validIDs []string
		totalReadSec := 0
		for _, cID := range draft.OrderedConceptIDs {
			if c, ok := conceptLookup[cID]; ok {
				validIDs = append(validIDs, cID)
				totalReadSec += c.EstimatedReadSeconds
			}
		}

		if len(validIDs) < MinCourseSize || len(validIDs) > MaxCourseSize {
			results = append(results, CurationResult{
				Category:   category,
				Difficulty: difficulty,
				Reason:     fmt.Sprintf("Course size %d outside allowed [%d, %d]", len(validIDs), MinCourseSize, MaxCourseSize),
			})
			continue
		}

		// Deduplication check (> 70% overlap with existing course)
		if overlaps, ratio := HasSignificantOverlap(validIDs, existingCourseIDs, OverlapThreshold); overlaps {
			results = append(results, CurationResult{
				Category:   category,
				Difficulty: difficulty,
				Reason:     fmt.Sprintf("Skipped: overlaps %.0f%% with existing course", ratio*100),
			})
			continue
		}

		// Create course document
		courseID := id.Unique()
		now := time.Now().UTC()
		courseDoc := CourseDoc{
			Slug:             Slugify(draft.Title),
			Title:            draft.Title,
			Description:      draft.Description,
			PrimaryCategory:  category,
			Difficulty:       difficulty,
			ConceptIDs:       validIDs,
			TotalReadSeconds: totalReadSec,
			Status:           "published",
			Source:           "ai_curated",
			CreatedAt:        now,
			UpdatedAt:        now,
			StartedCount:     0,
			CompletedCount:   0,
		}

		_, err = db.CreateDocument(cfg.DatabaseID, CollectionCourses, courseID, courseDoc)
		if err != nil {
			results = append(results, CurationResult{
				Category:   category,
				Difficulty: difficulty,
				Reason:     fmt.Sprintf("Failed to write course: %v", err),
			})
			continue
		}

		results = append(results, CurationResult{
			Category:      category,
			Difficulty:    difficulty,
			CourseCreated: true,
			CourseID:      courseID,
			Title:         draft.Title,
			ConceptCount:  len(validIDs),
			ConceptIDs:    validIDs,
		})
	}

	return results, nil
}

type groupKey struct {
	Category   string
	Difficulty string
}

func fetchPublishedConcepts(db *databases.Databases, dbID, filterCat, filterDiff string) (
	map[groupKey][]ConceptSummary, map[string]ConceptSummary, error,
) {
	queries := []string{
		query.Equal("status", "published"),
		query.Limit(100),
	}
	if filterCat != "" {
		queries = append(queries, query.Equal("category", filterCat))
	}
	if filterDiff != "" {
		queries = append(queries, query.Equal("difficulty", filterDiff))
	}

	list, err := db.ListDocuments(dbID, CollectionConcepts, db.WithListDocumentsQueries(queries))
	if err != nil {
		return nil, nil, err
	}

	grouped := make(map[groupKey][]ConceptSummary)
	lookup := make(map[string]ConceptSummary)

	for _, doc := range list.Documents {
		var c struct {
			Title                string `json:"title"`
			OneLiner             string `json:"oneLiner"`
			EstimatedReadSeconds int    `json:"estimatedReadSeconds"`
			Category             string `json:"category"`
			Difficulty           string `json:"difficulty"`
		}
		if doc.Decode(&c) != nil || c.Title == "" {
			continue
		}

		item := ConceptSummary{
			ID:                   doc.Id,
			Title:                c.Title,
			OneLiner:             c.OneLiner,
			EstimatedReadSeconds: c.EstimatedReadSeconds,
			Difficulty:           c.Difficulty,
			Category:             c.Category,
		}
		k := groupKey{Category: c.Category, Difficulty: c.Difficulty}
		grouped[k] = append(grouped[k], item)
		lookup[doc.Id] = item
	}

	return grouped, lookup, nil
}

func fetchExistingCourseConceptIDs(db *databases.Databases, dbID, category string) [][]string {
	var courses [][]string
	list, err := db.ListDocuments(dbID, CollectionCourses, db.WithListDocumentsQueries([]string{
		query.Equal("primaryCategory", category),
		query.Equal("status", "published"),
		query.Limit(100),
	}))
	if err != nil {
		return courses
	}

	for _, doc := range list.Documents {
		var course struct {
			ConceptIDs []string `json:"conceptIds"`
		}
		if doc.Decode(&course) == nil && len(course.ConceptIDs) > 0 {
			courses = append(courses, course.ConceptIDs)
		}
	}
	return courses
}
