package handler

import (
	"fmt"
	"strings"
)

type ContentValidator struct {
	geminiClient   *GeminiClient
	validatorModel string
}

func NewContentValidator(gemini *GeminiClient, validatorModel string) *ContentValidator {
	if validatorModel == "" {
		validatorModel = "gemini-3.5-flash-lite"
	}
	return &ContentValidator{
		geminiClient:   gemini,
		validatorModel: validatorModel,
	}
}

func (v *ContentValidator) Validate(draft *ConceptDraft) ValidationResult {
	var reasons []string

	if strings.TrimSpace(draft.Title) == "" {
		reasons = append(reasons, "Missing title")
	}
	if strings.TrimSpace(draft.OneLiner) == "" {
		reasons = append(reasons, "Missing oneLiner")
	}
	if strings.TrimSpace(draft.Body.Definition) == "" {
		reasons = append(reasons, "Missing definition")
	}
	if strings.TrimSpace(draft.Body.WhyItMatters) == "" {
		reasons = append(reasons, "Missing whyItMatters")
	}
	if strings.TrimSpace(draft.Body.Example) == "" {
		reasons = append(reasons, "Missing example")
	}

	defWords := countWords(draft.Body.Definition)
	whyWords := countWords(draft.Body.WhyItMatters)
	exWords := countWords(draft.Body.Example)
	pitfallWords := countWords(draft.Body.CommonPitfall)
	interviewWords := countWords(draft.Body.InterviewAngle)
	totalWords := defWords + whyWords + exWords + pitfallWords + interviewWords

	if defWords > 55 {
		reasons = append(reasons, fmt.Sprintf("Definition word count (%d) exceeds limit (40)", defWords))
	}
	if whyWords > 80 {
		reasons = append(reasons, fmt.Sprintf("WhyItMatters word count (%d) exceeds limit (60)", whyWords))
	}
	if totalWords > 260 {
		reasons = append(reasons, fmt.Sprintf("Total word count (%d) exceeds hard cap (260)", totalWords))
	}

	if len(reasons) > 0 {
		return ValidationResult{Approved: false, Reasons: reasons}
	}

	if v.geminiClient != nil {
		accurate, feedback, err := v.geminiClient.FactCheckConcept(draft, v.validatorModel)
		if err == nil && !accurate {
			reasons = append(reasons, fmt.Sprintf("Fact-check failed: %s", feedback))
		}
	}

	return ValidationResult{
		Approved: len(reasons) == 0,
		Reasons:  reasons,
	}
}

func countWords(s string) int {
	return len(strings.Fields(strings.TrimSpace(s)))
}
