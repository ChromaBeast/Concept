export function buildConceptPrompt(topic, category, difficulty) {
  return `You are a Principal Software Engineer & Computer Science Educator writing content for the "Concept" microlearning platform.

Create an elite, high-density, concise microlearning entry for the topic:
TOPIC: "${topic}"
CATEGORY: "${category}"
DIFFICULTY: "${difficulty}"

You MUST adhere to these STRICT WORD LIMIT RULES (Cap = 230 words, Max = 260 words):
1. title: Clean, canonical title (2-5 words).
2. oneLiner: High-impact single-sentence summary (15-25 words).
3. body.definition: Core concept definition. HARD LIMIT: maximum 40 words.
4. body.whyItMatters: Practical architectural value & trade-offs. HARD LIMIT: maximum 60 words.
5. body.example: Idiomatic code snippet (TypeScript/Go/Python/SQL) or concrete scenario. HARD LIMIT: maximum 60 words, max 12 lines.
6. body.commonPitfall: Critical trap or anti-pattern engineers make. HARD LIMIT: maximum 40 words.
7. body.interviewAngle: How top tech companies test this in interviews. HARD LIMIT: maximum 30 words.
8. body.quickChecks: Exactly 2 active-recall questions testing intuition.
   - question (10-20 words)
   - answer (15-30 words)
9. visualAid: true if visual diagram/infographic adds high clarity, false otherwise.
10. imagePrompt: If visualAid is true, a precise prompt for a minimal flat-vector 2D architecture diagram.

Return ONLY a valid JSON object matching this schema:
{
  "title": string,
  "slug": string,
  "oneLiner": string,
  "category": string,
  "difficulty": string,
  "estimatedReadSeconds": number,
  "visualAid": boolean,
  "imagePrompt": string,
  "tagIds": string[],
  "body": {
    "definition": string,
    "whyItMatters": string,
    "example": string,
    "commonPitfall": string,
    "interviewAngle": string,
    "quickChecks": [
      { "question": string, "answer": string },
      { "question": string, "answer": string }
    ]
  }
}`;
}
