package handler

import (
	"regexp"
	"strings"
	"unicode"
)

var nonAlphaNumRegex = regexp.MustCompile(`[^a-z0-9]+`)

// Slugify converts a title into a URL-safe lowercase slug.
func Slugify(title string) string {
	s := strings.ToLower(strings.TrimSpace(title))
	s = nonAlphaNumRegex.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

// CountWords returns the number of whitespace-delimited words in a string.
func CountWords(text string) int {
	return len(strings.Fields(strings.TrimSpace(text)))
}

// GenerateOneLiner extracts a concise ~12-word summary from a definition.
func GenerateOneLiner(definition string) string {
	cleaned := strings.TrimSpace(definition)
	if cleaned == "" {
		return ""
	}
	// Split by sentence ending if possible
	if idx := strings.IndexAny(cleaned, ".!?"); idx != -1 && idx > 15 {
		firstSentence := strings.TrimSpace(cleaned[:idx])
		words := strings.Fields(firstSentence)
		if len(words) <= 15 {
			return firstSentence
		}
	}
	words := strings.Fields(cleaned)
	if len(words) > 12 {
		return strings.Join(words[:12], " ") + "..."
	}
	return cleaned
}

// CalculateReadSeconds estimates reading time in seconds (target 90-120s for card).
func CalculateReadSeconds(wordCount int) int {
	// Base reading speed for dense technical text is ~140 wpm (2.3 words/sec)
	// plus 30 seconds for quick-checks and code comprehension.
	seconds := int(float64(wordCount)/2.3) + 30
	if seconds < 75 {
		return 75
	}
	if seconds > 135 {
		return 135
	}
	return seconds
}

// NormalizeTag cleans a tag string into a standardized slug.
func NormalizeTag(tag string) string {
	tag = strings.ToLower(strings.TrimSpace(tag))
	var b strings.Builder
	for _, r := range tag {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '-' {
			b.WriteRune(r)
		} else if unicode.IsSpace(r) || r == '_' {
			b.WriteRune('-')
		}
	}
	result := strings.Trim(b.String(), "-")
	for strings.Contains(result, "--") {
		result = strings.ReplaceAll(result, "--", "-")
	}
	return result
}
