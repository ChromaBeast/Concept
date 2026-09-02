const MODEL_CASCADE = [
  { name: 'gemini-3.8-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-3.7-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-3.6-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-2.0-flash', delayMs: 5000, type: 'flash' },
  { name: 'gemini-1.5-flash', delayMs: 5000, type: 'flash' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function callGeminiCascade(prompt, apiKey) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not provided.');
  }

  let lastError = null;

  for (const model of MODEL_CASCADE) {
    const { name, delayMs } = model;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${apiKey}`;

    console.log(`      • Attempting model: ${name}...`);

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
        console.warn(`      ⏳ Rate limit (429) on ${name}. Waiting ${delayMs / 1000}s...`);
        await sleep(delayMs);
        continue;
      }

      if (response.status === 404) {
        console.log(`      ↪ Model ${name} not available in this region (404), trying next...`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`      ⚠️ HTTP ${response.status} on ${name}: ${errText.slice(0, 100)}`);
        lastError = new Error(`HTTP ${response.status} on ${name}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty payload from Gemini');

      const cleaned = cleanJSON(rawText);
      const parsed = JSON.parse(cleaned);

      console.log(`      ✅ Successfully generated with ${name}!`);
      return { concept: parsed, modelUsed: name };
    } catch (err) {
      console.warn(`      ⚠️ ${name} error: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}

function cleanJSON(raw) {
  let s = raw.trim();
  if (s.startsWith('```json')) s = s.slice(7);
  if (s.startsWith('```')) s = s.slice(3);
  if (s.endsWith('```')) s = s.slice(0, -3);
  return s.trim();
}
