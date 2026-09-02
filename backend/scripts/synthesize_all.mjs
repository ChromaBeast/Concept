import fs from 'fs';
import path from 'path';
import { appwriteWriter } from './synthesizer/appwriteWriter.mjs';
import { callGeminiCascade } from './synthesizer/geminiClient.mjs';
import { buildConceptPrompt } from './synthesizer/promptBuilder.mjs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const BACKUP_FILE = path.join(process.cwd(), 'backend', 'data', 'synthesized_concepts.json');

// Ensure backup dir exists
fs.mkdirSync(path.dirname(BACKUP_FILE), { recursive: true });

function countWords(str = '') {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function validateConcept(c) {
  const body = c.body || {};
  const defWords = countWords(body.definition);
  const whyWords = countWords(body.whyItMatters);
  const pitfallWords = countWords(body.commonPitfall);
  const totalWords = defWords + whyWords + countWords(body.example) + pitfallWords + countWords(body.interviewAngle);

  const reasons = [];
  if (defWords > 45) reasons.push(`Definition exceeded: ${defWords}/40 words`);
  if (whyWords > 65) reasons.push(`Why It Matters exceeded: ${whyWords}/60 words`);
  if (totalWords > 260) reasons.push(`Total words exceeded: ${totalWords}/260 words`);

  return { approved: reasons.length === 0, reasons, totalWords };
}

async function runSynthesis() {
  console.log('🚀 Starting Concept Microlearning Batch Synthesizer...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let totalPublished = 0;
  let totalReviewed = 0;

  while (true) {
    const pendingTopics = await appwriteWriter.fetchPendingTopics(25);
    if (pendingTopics.length === 0) {
      console.log('\n🎉 ALL 205 ROADMAP TOPICS HAVE BEEN SYNTHESIZED AND PUBLISHED!');
      break;
    }

    console.log(`\n📋 Found batch of ${pendingTopics.length} pending topics in Appwrite DB.`);

    for (let i = 0; i < pendingTopics.length; i++) {
      const topic = pendingTopics[i];
      console.log(`\n[${i + 1}/${pendingTopics.length}] Synthesizing: "${topic.topic}" (${topic.category} - ${topic.difficulty})`);

      await appwriteWriter.claimTopic(topic.$id);

      if (GEMINI_API_KEY) {
        // Direct Synthesis Mode with Gemini Cascade
        try {
          const prompt = buildConceptPrompt(topic.topic, topic.category, topic.difficulty);
          const { concept, modelUsed } = await callGeminiCascade(prompt, GEMINI_API_KEY);

          const validation = validateConcept(concept);
          const status = validation.approved ? 'published' : 'needs_review';

          const docData = {
            slug: concept.slug || topic.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: concept.title || topic.topic,
            oneLiner: concept.oneLiner,
            category: topic.category,
            difficulty: topic.difficulty,
            body: concept.body,
            estimatedReadSeconds: concept.estimatedReadSeconds || 90,
            status,
            aiModel: modelUsed,
            visualAid: Boolean(concept.visualAid),
            imagePrompt: concept.imagePrompt || '',
            needsReviewReasons: validation.reasons,
          };

          await appwriteWriter.saveConcept(docData);
          await appwriteWriter.completeTopic(topic.$id);

          // Append to local backup
          let existing = [];
          if (fs.existsSync(BACKUP_FILE)) {
            try { existing = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8')); } catch {}
          }
          existing.push(docData);
          fs.writeFileSync(BACKUP_FILE, JSON.stringify(existing, null, 2));

          if (status === 'published') {
            totalPublished++;
            console.log(`   ✅ Published via ${modelUsed} (${validation.totalWords} words) -> Saved to Appwrite DB`);
          } else {
            totalReviewed++;
            console.log(`   ⚠️ Flagged (${validation.reasons.join(', ')}) -> Saved to Appwrite DB`);
          }
        } catch (err) {
          console.error(`   ❌ Synthesis Failed: ${err.message}`);
          await appwriteWriter.failTopic(topic.$id, err.message);
        }
      } else {
        // Cloud Function Batch Mode
        try {
          console.log(`   ⚡ Triggering Cloud Function "conceptEngine" (batch=5)...`);
          const res = await appwriteWriter.triggerCloudBatch(5);
          console.log(`   Cloud Function result: Published=${res.published || 0}, Reviewed=${res.reviewed || 0}`);
          totalPublished += res.published || 0;
          totalReviewed += res.reviewed || 0;
          // Pacing 12.5s between cloud function batches
          await new Promise((r) => setTimeout(r, 12500));
          break; // Break inner loop to re-fetch pending topics
        } catch (err) {
          console.error(`   ❌ Cloud Function Error: ${err.message}`);
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    }
  }

  console.log('\n📊 Synthesis Summary:');
  console.log(`   • Total Published Concepts: ${totalPublished}`);
  console.log(`   • Total Needs Review: ${totalReviewed}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

runSynthesis();
