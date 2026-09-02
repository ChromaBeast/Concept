package handler

import (
	"encoding/json"
	"fmt"
	"strings"
)

const (
	HardWordCap = 260
)

// ValidateConcept runs the 3-stage validation pipeline:
// 1. Schema Check
// 2. Word-count Gate (<= 260 words)
// 3. Factual Self-Check via Gemini
func ValidateConcept(payload *GeneratedConceptPayload, gemini *GeminiClient) ValidationResult {
	var reasons []string

	// Check 1: Schema Integrity
	schemaErrors := validateSchema(payload)
	reasons = append(reasons, schemaErrors...)

	// Check 2: Word Count Hard Cap
	wordCount := calculateTotalWordCount(payload)
	if wordCount > HardWordCap {
		reasons = append(reasons, fmt.Sprintf("Word count %d exceeds hard cap of %d words", wordCount, HardWordCap))
	}

	// If basic checks already failed, return early to save API calls
	if len(reasons) > 0 {
		return ValidationResult{
			Passed:    false,
			Reasons:   reasons,
			WordCount: wordCount,
		}
	}

	// Check 3: Factual Self-Check
	payloadBytes, _ := json.Marshal(payload)
	selfCheck, err := gemini.SelfCheckFactualAccuracy(string(payloadBytes))
	if err != nil {
		reasons = append(reasons, fmt.Sprintf("Factual self-check error: %v", err))
	} else if !selfCheck.Pass {
		if len(selfCheck.Issues) > 0 {
			reasons = append(reasons, selfCheck.Issues...)
		} else {
			reasons = append(reasons, "Failed factual self-check validation")
		}
	}

	return ValidationResult{
		Passed:    len(reasons) == 0,
		Reasons:   reasons,
		WordCount: wordCount,
	}
}

// validateSchema ensures all required fields are present and non-empty.
func validateSchema(p *GeneratedConceptPayload) []string {
	var errs []string
	if strings.TrimSpace(p.Definition) == "" {
		errs = append(errs, "Definition is empty")
	}
	if strings.TrimSpace(p.WhyItMatters) == "" {
		errs = append(errs, "WhyItMatters is empty")
	}
	if strings.TrimSpace(p.Example) == "" {
		errs = append(errs, "Example is empty")
	}
	if strings.TrimSpace(p.CommonPitfall) == "" {
		errs = append(errs, "CommonPitfall is empty")
	}
	if strings.TrimSpace(p.InterviewAngle) == "" {
		errs = append(errs, "InterviewAngle is empty")
	}
	if len(p.QuickChecks) == 0 {
		errs = append(errs, "QuickChecks must contain at least 1 item")
	} else {
		for i, qc := range p.QuickChecks {
			if strings.TrimSpace(qc.Question) == "" || strings.TrimSpace(qc.Answer) == "" {
				errs = append(errs, fmt.Sprintf("QuickCheck #%d has empty question or answer", i+1))
			}
		}
	}
	return errs
}

// calculateTotalWordCount computes the combined words of the card's body sections.
func calculateTotalWordCount(p *GeneratedConceptPayload) int {
	return CountWords(p.Definition) +
		CountWords(p.WhyItMatters) +
		CountWords(p.Example) +
		CountWords(p.CommonPitfall) +
		CountWords(p.InterviewAngle)
}
