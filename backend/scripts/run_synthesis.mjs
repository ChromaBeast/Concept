import fs from 'fs';
import path from 'path';
import { callGeminiCascade, cleanJSON } from './synthesize_pipeline.mjs';

const SEED_TOPICS_FILE = path.join(process.cwd(), 'backend/scripts/seed_roadmap_topics.json');
const OUTPUT_FILE = path.join(process.cwd(), 'backend/generated_concepts.json');

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || process.argv[2];
  if (!apiKey) {
    console.error('❌ Error: Please provide your GEMINI_API_KEY as an argument or environment variable:');
    console.error('   Usage: bun backend/scripts/run_synthesis.mjs <GEMINI_API_KEY>');
    process.exit(1);
  }

  console.log('🚀 Starting Concept Knowledge Synthesis Pipeline with Adaptive Cascade...\n');

  let rawTopics = [];
  try {
    rawTopics = JSON.parse(fs.readFileSync(SEED_TOPICS_FILE, 'utf8'));
  } catch (e) {
    rawTopics = [
      { topic: 'Bloom Filters', category: 'databases', difficulty: 'intermediate' },
      { topic: 'B-Tree vs LSM-Tree', category: 'databases', difficulty: 'advanced' },
      { topic: 'Distributed Lock via Redis (Redlock)', category: 'system_design', difficulty: 'intermediate' },
      { topic: 'Backpressure & Reactive Streams', category: 'backend', difficulty: 'intermediate' },
      { topic: 'TCP Window Scaling & Congestion Control', category: 'networking', difficulty: 'intermediate' },
      { topic: 'Copy-on-Write (COW) Memory Forking', category: 'operating_systems', difficulty: 'advanced' },
    ];
  }

  let generatedList = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      generatedList = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch (e) {
      generatedList = [];
    }
  }

  const existingTitles = new Set(generatedList.map((c) => c.title.toLowerCase()));
  const pendingTopics = rawTopics.filter((t) => !existingTitles.has(t.topic.toLowerCase()));

  console.log(`📊 Total Topics: ${rawTopics.length} | Already Synthesized: ${generatedList.length} | Pending: ${pendingTopics.length}\n`);

  for (let i = 0; i < pendingTopics.length; i++) {
    const item = pendingTopics[i];
    console.log(`[${i + 1}/${pendingTopics.length}] Synthesizing: "${item.topic}" (${item.category})...`);

    const prompt = `You are a staff software engineer creating a concise reference on "${item.topic}".
Category: ${item.category}, Difficulty: ${item.difficulty}.
Rules:
1. Definition: strictly <= 40 words.
2. Why It Matters: strictly <= 60 words.
3. Example: strictly <= 60 words or <= 12 lines of code.
4. Common Pitfall: strictly <= 40 words.
5. Interview Angle: strictly <= 30 words.
6. Total word count across all body text must not exceed 230 words.
7. Include 1-2 QuickChecks (question + concise answer).
8. VisualAid: boolean. If true, provide a brief imagePrompt for generating an infographic.

Return strictly JSON matching this structure:
{
  "slug": "${item.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}",
  "title": "${item.topic}",
  "oneLiner": "One sentence punchy summary",
  "category": "${item.category}",
  "difficulty": "${item.difficulty}",
  "tagNames": ["${item.category}", "SWE"],
  "estimatedReadSeconds": 90,
  "visualAid": true,
  "imagePrompt": "Infographic showing ${item.topic} architecture",
  "askedByCompanies": ["Google", "Meta", "Amazon"],
  "body": {
    "definition": "...",
    "whyItMatters": "...",
    "example": "...",
    "commonPitfall": "...",
    "interviewAngle": "...",
    "quickChecks": [{"question": "...", "answer": "..."}]
  }
}`;

    try {
      const { text, modelUsed } = await callGeminiCascade(prompt, apiKey);
      const parsed = JSON.parse(cleanJSON(text));
      parsed.id = `gen_${Date.now()}_${i}`;
      parsed.status = 'published';
      parsed.source = 'ai_generated_reviewed';
      parsed.aiModel = modelUsed;

      generatedList.push(parsed);
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(generatedList, null, 2));
      console.log(`   ✨ Saved "${parsed.title}" (Model: ${modelUsed})`);
    } catch (err) {
      console.error(`   ❌ Failed synthesizing "${item.topic}": ${err.message}`);
    }
  }

  console.log(`\n🎉 Synthesis complete! Total synthesized concepts: ${generatedList.length}`);
}

main();
