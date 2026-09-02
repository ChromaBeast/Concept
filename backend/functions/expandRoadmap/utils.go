package handler

import (
	"regexp"
	"strings"
)

var (
	nonAlphaNum = regexp.MustCompile(`[^a-z0-9]+`)
	Categories  = []string{
		"dsa",
		"system_design",
		"databases",
		"operating_systems",
		"networking",
		"oop_design_patterns",
		"frontend",
		"backend",
		"devops_infra",
		"security",
		"cloud",
		"behavioral_interview",
	}
)

// NormalizeTitle returns a normalized lowercase alphanumeric representation for deduplication.
func NormalizeTitle(title string) string {
	s := strings.ToLower(strings.TrimSpace(title))
	s = nonAlphaNum.ReplaceAllString(s, "")
	return s
}

// NormalizeDifficulty ensures difficulty is one of beginner, intermediate, or advanced.
func NormalizeDifficulty(diff string) string {
	d := strings.ToLower(strings.TrimSpace(diff))
	switch d {
	case "beginner", "intermediate", "advanced":
		return d
	default:
		return "intermediate"
	}
}
