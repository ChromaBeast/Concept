const MODEL_CASCADE = [
  { name: 'gemini-3.7-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-3.6-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-3.5-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-3.5-flash-lite', delayMs: 4200, type: 'lite' },
  { name: 'gemini-3.1-flash-lite', delayMs: 4200, type: 'lite' },
  { name: 'gemini-2.0-flash', delayMs: 12500, type: 'flash' },
  { name: 'gemini-1.5-flash', delayMs: 12500, type: 'flash' },
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
        console.warn(`⏳ Rate limit hit on ${name}. Waiting ${delayMs / 1000}s...`);
        await sleep(delayMs);
        continue;
      }

      if (response.status === 404) {
        // Model not available in this region/key, fall through to next
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        lastError = new Error(`HTTP ${response.status} on ${name}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty payload from Gemini');

      const cleaned = cleanJSON(rawText);
      const parsed = JSON.parse(cleaned);

      // Pacing delay before next request to respect RPM
      await sleep(delayMs);
      return { concept: parsed, modelUsed: name };
    } catch (err) {
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
