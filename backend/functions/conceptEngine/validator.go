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
		validatorModel = "gemini-3.8-flash"
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

	if defWords > 75 {
		reasons = append(reasons, fmt.Sprintf("Definition word count (%d) exceeds limit (75)", defWords))
	}
	if whyWords > 110 {
		reasons = append(reasons, fmt.Sprintf("WhyItMatters word count (%d) exceeds limit (110)", whyWords))
	}
	if totalWords > 350 {
		reasons = append(reasons, fmt.Sprintf("Total core word count (%d) exceeds hard cap (350)", totalWords))
	}

	if draft.NeedsDeepDive && draft.DeepDive != nil {
		deepWords := 0
		for _, sec := range draft.DeepDive.Sections {
			deepWords += countWords(sec.Heading) + countWords(sec.Content)
		}
		if draft.Difficulty == "beginner" && deepWords > 100 {
			reasons = append(reasons, "Beginner concepts should not have extended deep dives")
		} else if draft.Difficulty == "intermediate" && deepWords > 500 {
			reasons = append(reasons, fmt.Sprintf("Intermediate deep dive word count (%d) exceeds budget (400)", deepWords))
		} else if draft.Difficulty == "advanced" && deepWords > 1100 {
			reasons = append(reasons, fmt.Sprintf("Advanced deep dive word count (%d) exceeds budget (900)", deepWords))
		}
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
