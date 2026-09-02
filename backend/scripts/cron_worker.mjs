import { appwriteWriter } from './synthesizer/appwriteWriter.mjs';
import { callGeminiCascade } from './synthesizer/geminiClient.mjs';
import { buildConceptPrompt } from './synthesizer/promptBuilder.mjs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const INTERVAL_MS = 60 * 1000; // 1 minute interval

function countWords(str = '') {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function checkCompliance(concept) {
  const body = concept.body || {};
  const defWords = countWords(body.definition);
  const whyWords = countWords(body.whyItMatters);
  const pitfallWords = countWords(body.commonPitfall);
  const total = defWords + whyWords + countWords(body.example) + pitfallWords + countWords(body.interviewAngle);

  const reasons = [];
  if (defWords > 45) reasons.push(`Def: ${defWords}/40 words`);
  if (whyWords > 65) reasons.push(`Why: ${whyWords}/60 words`);
  if (total > 260) reasons.push(`Total: ${total}/260 words`);

  return { reasons, total };
}

let generatedCount = 0;

async function processNextTopic() {
  const now = new Date().toLocaleTimeString();
  console.log(`\n[${now}] ⏱️ Cron Trigger: Searching for next pending roadmap topic...`);

  try {
    const topics = await appwriteWriter.fetchPendingTopics(1);
    if (topics.length === 0) {
      console.log('   🎉 All roadmap topics have been generated!');
      return;
    }

    const topic = topics[0];
    console.log(`   📌 Claimed: "${topic.topic}" (${topic.category} - ${topic.difficulty})`);
    await appwriteWriter.claimTopic(topic.$id);

    console.log(`   🤖 Generating via Gemini 3.7 / 3.6 Flash cascade...`);
    const prompt = buildConceptPrompt(topic.topic, topic.category, topic.difficulty);
    const { concept, modelUsed } = await callGeminiCascade(prompt, GEMINI_API_KEY);

    const compliance = checkCompliance(concept);
    const docData = {
      slug: concept.slug || topic.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: concept.title || topic.topic,
      oneLiner: concept.oneLiner,
      category: topic.category,
      difficulty: topic.difficulty,
      body: concept.body,
      estimatedReadSeconds: concept.estimatedReadSeconds || 85,
      status: 'needs_review', // Queued for review
      aiModel: modelUsed,
      visualAid: Boolean(concept.visualAid),
      imagePrompt: concept.imagePrompt || '',
      needsReviewReasons: compliance.reasons,
    };

    const created = await appwriteWriter.saveConcept(docData);
    await appwriteWriter.completeTopic(topic.$id);
    generatedCount++;

    console.log(`   ✅ Concept Generated & Queued for Review!`);
    console.log(`      • ID: ${created.$id} | Model: ${modelUsed} | Words: ${compliance.total}`);
    console.log(`      • Status: "needs_review" -> Ready in Admin Dashboard Review Drawer`);
    console.log(`      • Total Generated this session: ${generatedCount}`);
  } catch (err) {
    console.error(`   ❌ Generation failed:`, err.message);
  }

  console.log(`   ⏳ Next concept generation in 60 seconds...`);
}

async function startCron() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🕒 Concept Microlearning Automated 1-Minute Cron Engine');
  console.log('   Model: Gemini 3.7 Flash -> 3.6 Flash -> Lite Cascade');
  console.log('   Workflow: 1 Concept / Minute -> Queued in "needs_review" -> Triage & Publish');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Process immediately
  await processNextTopic();

  // Recurring 60-second timer
  setInterval(processNextTopic, INTERVAL_MS);
}

startCron();
