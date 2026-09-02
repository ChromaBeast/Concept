import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Cascade: 3.8 Flash -> 3.7 Flash -> 3.6 Flash -> 3.1 Flash Lite -> 2.0 Flash
const MODEL_CASCADE = [
  { name: 'gemini-3.8-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-3.7-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-3.6-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-3.1-flash-lite', delayMs: 4200, type: 'lite' },
  { name: 'gemini-2.0-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-1.5-flash', delayMs: 12500, type: 'flash' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function callGeminiCascade(prompt, apiKey = GEMINI_API_KEY) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please pass or export GEMINI_API_KEY.');
  }

  let lastError = null;

  for (const modelConfig of MODEL_CASCADE) {
    const { name, delayMs } = modelConfig;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${apiKey}`;

    console.log(`🤖 Attempting synthesis with model: ${name}...`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      });

      if (response.status === 429) {
        console.warn(`⏳ Rate limit (429) on ${name}. Backing off for ${delayMs / 1000}s...`);
        await sleep(delayMs);
        continue;
      }

      if (response.status === 404) {
        console.warn(`⚠️ Model ${name} not available (404). Falling back to next model...`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`⚠️ ${name} error (${response.status}): ${errText}`);
        lastError = new Error(`HTTP ${response.status}: ${errText}`);
        await sleep(3000);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Empty response payload');
      }

      // Respect rate limit spacing before next call
      console.log(`✅ Success with ${name}! Pacing ${delayMs / 1000}s for rate limits.`);
      await sleep(delayMs);

      return { text, modelUsed: name };
    } catch (err) {
      console.warn(`⚠️ Exception calling ${name}: ${err.message}`);
      lastError = err;
      await sleep(3000);
    }
  }

  throw new Error(`All fallback models in cascade failed: ${lastError?.message}`);
}

export function cleanJSON(raw) {
  let s = raw.trim();
  if (s.startsWith('```json')) s = s.slice(7);
  if (s.startsWith('```')) s = s.slice(3);
  if (s.endsWith('```')) s = s.slice(0, -3);
  return s.trim();
}
