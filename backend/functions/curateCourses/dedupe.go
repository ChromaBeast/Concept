package handler

import (
	"regexp"
	"strings"
)

var nonAlphaNumRegex = regexp.MustCompile(`[^a-z0-9]+`)

// Slugify converts a course title into a URL-friendly slug.
func Slugify(title string) string {
	s := strings.ToLower(strings.TrimSpace(title))
	s = nonAlphaNumRegex.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

// CalculateOverlapRatio computes the overlap ratio between two sets of concept IDs.
// Overlap ratio = len(intersection) / min(len(a), len(b)).
func CalculateOverlapRatio(a, b []string) float64 {
	if len(a) == 0 || len(b) == 0 {
		return 0.0
	}

	setA := make(map[string]struct{}, len(a))
	for _, id := range a {
		setA[id] = struct{}{}
	}

	intersectionCount := 0
	for _, id := range b {
		if _, exists := setA[id]; exists {
			intersectionCount++
		}
	}

	minLen := len(a)
	if len(b) < minLen {
		minLen = len(b)
	}

	return float64(intersectionCount) / float64(minLen)
}

// HasSignificantOverlap checks if candidate IDs overlap > 70% with any existing course IDs.
func HasSignificantOverlap(candidateIDs []string, existingCourses [][]string, threshold float64) (bool, float64) {
	for _, existing := range existingCourses {
		ratio := CalculateOverlapRatio(candidateIDs, existing)
		if ratio >= threshold {
			return true, ratio
		}
	}
	return false, 0.0
}
