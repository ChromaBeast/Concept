import { appwriteWriter } from './synthesizer/appwriteWriter.mjs';
import { callGeminiCascade } from './synthesizer/geminiClient.mjs';
import { buildConceptPrompt } from './synthesizer/promptBuilder.mjs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

async function generateOne() {
  const topics = await appwriteWriter.fetchPendingTopics(1);
  if (!topics || topics.length === 0) {
    console.log('No pending topics found in Appwrite DB.');
    return;
  }

  const t = topics[0];
  console.log(`📌 Processing topic: "${t.topic}" (${t.category} - ${t.difficulty})...`);
  await appwriteWriter.claimTopic(t.$id);

  const prompt = buildConceptPrompt(t.topic, t.category, t.difficulty);
  const { concept, modelUsed } = await callGeminiCascade(prompt, GEMINI_API_KEY);

  console.log(`✅ Generated: "${concept.title}" using ${modelUsed}`);

  const doc = await appwriteWriter.saveConcept({
    slug: concept.slug || t.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: concept.title || t.topic,
    oneLiner: concept.oneLiner,
    category: t.category,
    difficulty: t.difficulty,
    body: concept.body,
    estimatedReadSeconds: concept.estimatedReadSeconds || 85,
    status: 'needs_review', // Queued for review
    aiModel: modelUsed,
    visualAid: Boolean(concept.visualAid),
    imagePrompt: concept.imagePrompt || '',
    needsReviewReasons: [],
  });

  console.log(`💾 Saved to Appwrite DB -> Document ID: ${doc.$id} | Status: "${doc.status}"`);
  await appwriteWriter.completeTopic(t.$id);
  console.log(`🎉 Topic marked done. Concept is now ready in Admin Review & Triage Drawer!`);
}

generateOne();
