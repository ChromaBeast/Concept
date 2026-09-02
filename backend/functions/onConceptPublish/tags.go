package handler

import (
	"fmt"
	"strings"
	"unicode"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/databases"
	"github.com/appwrite/sdk-for-go/id"
	"github.com/appwrite/sdk-for-go/query"
	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

const CollectionTags = "tags"

// ProcessConceptPublish handles updating tag counts and syncing categories for published concepts.
func ProcessConceptPublish(ctx *openruntimes.Context, cfg *PublishConfig, concept ConceptEventDoc) (*PublishSyncResult, error) {
	if concept.Status != "published" {
		ctx.Log(fmt.Sprintf("Skipping: concept %s has status '%s' (not 'published')", concept.ID, concept.Status))
		return &PublishSyncResult{
			ConceptID: concept.ID,
			Status:    concept.Status,
		}, nil
	}

	client := appwrite.NewClient(
		appwrite.WithEndpoint(cfg.Endpoint),
		appwrite.WithProject(cfg.ProjectID),
		appwrite.WithKey(cfg.APIKey),
	)
	db := databases.New(client)

	result := &PublishSyncResult{
		ConceptID:   concept.ID,
		Status:      concept.Status,
		Category:    concept.Category,
		UpdatedTags: []string{},
		CreatedTags: []string{},
	}

	for _, rawTag := range concept.TagIDs {
		tagSlug := NormalizeSlug(rawTag)
		if tagSlug == "" {
			result.SkippedCount++
			continue
		}

		err := syncTagUsage(ctx, db, cfg.DatabaseID, tagSlug, concept.Category, result)
		if err != nil {
			ctx.Error(fmt.Sprintf("Error syncing tag '%s': %v", tagSlug, err))
			result.SkippedCount++
		}
	}

	ctx.Log(fmt.Sprintf("Publish sync complete for '%s' (%s): Updated %d tags, Created %d tags",
		concept.Title, concept.ID, len(result.UpdatedTags), len(result.CreatedTags)))

	return result, nil
}

// syncTagUsage finds an existing tag to increment or creates a new one.
func syncTagUsage(
	ctx *openruntimes.Context,
	db *databases.Databases,
	dbID, tagSlug, category string,
	result *PublishSyncResult,
) error {
	list, err := db.ListDocuments(
		dbID,
		CollectionTags,
		db.WithListDocumentsQueries([]string{
			query.Equal("slug", tagSlug),
			query.Limit(1),
		}),
	)
	if err != nil {
		return fmt.Errorf("failed to list tags: %w", err)
	}

	if len(list.Documents) > 0 {
		existingDoc := list.Documents[0]
		var existingTag TagDoc
		if err := existingDoc.Decode(&existingTag); err == nil {
			newCount := existingTag.UsageCount + 1
			_, updateErr := db.UpdateDocument(
				dbID,
				CollectionTags,
				existingDoc.Id,
				db.WithUpdateDocumentData(map[string]any{
					"usageCount": newCount,
				}),
			)
			if updateErr != nil {
				return fmt.Errorf("failed to increment tag usage: %w", updateErr)
			}
			result.UpdatedTags = append(result.UpdatedTags, tagSlug)
			return nil
		}
	}

	// Tag does not exist yet -> create it
	newTag := TagDoc{
		Name:       FormatTagName(tagSlug),
		Slug:       tagSlug,
		UsageCount: 1,
		Category:   category,
	}

	_, createErr := db.CreateDocument(
		dbID,
		CollectionTags,
		id.Unique(),
		newTag,
	)
	if createErr != nil {
		return fmt.Errorf("failed to create tag '%s': %w", tagSlug, createErr)
	}

	result.CreatedTags = append(result.CreatedTags, tagSlug)
	return nil
}

// NormalizeSlug formats a tag string into a clean lowercase slug.
func NormalizeSlug(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	var b strings.Builder
	for _, r := range s {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '-' {
			b.WriteRune(r)
		} else if unicode.IsSpace(r) || r == '_' {
			b.WriteRune('-')
		}
	}
	res := strings.Trim(b.String(), "-")
	for strings.Contains(res, "--") {
		res = strings.ReplaceAll(res, "--", "-")
	}
	return res
}

// FormatTagName converts a slug like 'distributed-systems' to 'Distributed Systems'.
func FormatTagName(slug string) string {
	parts := strings.Split(slug, "-")
	for i, p := range parts {
		if len(p) > 0 {
			runes := []rune(p)
			runes[0] = unicode.ToUpper(runes[0])
			parts[i] = string(runes)
		}
	}
	return strings.Join(parts, " ")
}
