/**
 * utils/combinedPriceFeed.js
 * - Fetches baseline commodity prices (USD)
 * - Converts USD -> ZMW using a forex API
 * - Calls OpenAI to generate small realistic adjustments
 * - Merges baseline + AI adjustments into final prices
 *
 * NOTE: Adapt api symbols and conversion logic to your chosen commodity provider.
 */

import fetch from "node-fetch";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure your tracked commodities here and their API symbols
const COMMODITIES = [
  { name: "Copper", apiSymbol: "COPPER", unit: "kg" },
  { name: "Maize", apiSymbol: "CORN", unit: "kg" },
  { name: "Gold", apiSymbol: "GOLD", unit: "kg" },
  { name: "Diamonds", apiSymbol: "DIAMOND", unit: "carat" }
];

// Example provider endpoints - replace with your actual provider's endpoints and parsing logic
async function fetchCommodityUSD(apiSymbol) {
  // Example using commodities-api.com — change URL & parsing to match your provider.
  const apiKey = process.env.COMMODITIES_API_KEY;
  const url = `https://commodities-api.com/api/latest?access_key=${apiKey}&symbols=${apiSymbol}&base=USD`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Commodity API error for ${apiSymbol}: ${res.status}`);
  }
  const body = await res.json();

  // provider-specific: adjust to where the price exists in returned JSON
  // Example: body.data.rates[apiSymbol] might be USD per unit
  const price = body?.data?.rates?.[apiSymbol];
  if (price == null) {
    throw new Error(`Missing price for ${apiSymbol}`);
  }
  return Number(price);
}

async function fetchUSDtoZMWRate() {
  // Using exchangerate.host (no key) as default. Replace if you prefer another provider.
  const url = `https://api.exchangerate.host/latest?base=USD&symbols=ZMW`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Forex API error");
  const body = await res.json();
  return Number(body?.rates?.ZMW ?? 24.5);
}

function maybeConvertToKg(usdPrice, apiSymbol) {
  // Some APIs return per ton or per ounce. Adjust here:
  // If provider returns per ton: return usdPrice / 1000
  // If provider returns per ounce: convert accordingly.
  // Default assumes price already per kg.
  return Number(usdPrice);
}

export async function buildBaselinePrices() {
  const usdToZmw = await fetchUSDtoZMWRate();
  const baselines = [];

  for (const c of COMMODITIES) {
    let usdPrice;
    try {
      usdPrice = await fetchCommodityUSD(c.apiSymbol);
    } catch (err) {
      console.warn("Commodity fetch error for", c.apiSymbol, err.message);
      continue;
    }

    const pricePerKgUsd = maybeConvertToKg(usdPrice, c.apiSymbol);
    const zmwPerKg = pricePerKgUsd * usdToZmw;

    baselines.push({
      name: c.name,
      apiSymbol: c.apiSymbol,
      baselineUsdPerKg: Number(pricePerKgUsd.toFixed(6)),
      baselineZmwPerKg: Number(zmwPerKg.toFixed(2)),
      unit: c.unit
    });
  }
  return baselines;
}

/**
 * Ask OpenAI to output small adjustments and confidence as JSON.
 * If OpenAI fails or returns unparsable text, fallback to randomized small deltas.
 */
export async function getAIAdjustedPrices(baselines) {
  const prompt = `
You are a helpful market assistant. Given this JSON array of baseline commodity prices in ZMW per kg,
return a JSON array of the same length with these fields:
name, baselineZmwPerKg, aiAdjustedZmwPerKg, deltaPercent, direction, confidenceOutOf100, note

Rules:
- Make short-term realistic adjustments between -3% and +3%.
- Confidence should be 0-100.
- Note must be one short sentence.
Return ONLY valid JSON.
Input:
${JSON.stringify(baselines, null, 2)}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 800
    });

    const raw = response.choices?.[0]?.message?.content ?? null;
    const parsed = JSON.parse(raw);
    return parsed.map((p) => ({
      ...p,
      aiAdjustedZmwPerKg: Number(p.aiAdjustedZmwPerKg),
      deltaPercent: Number(p.deltaPercent)
    }));
  } catch (err) {
    console.warn("OpenAI fallback: ", err.message);
    // Fallback random adjustments -3%..+3%
    return baselines.map((b) => {
      const delta = (Math.random() * 6 - 3); // percent
      const adjusted = b.baselineZmwPerKg * (1 + delta / 100);
      return {
        name: b.name,
        baselineZmwPerKg: b.baselineZmwPerKg,
        aiAdjustedZmwPerKg: Number(adjusted.toFixed(2)),
        deltaPercent: Number(delta.toFixed(2)),
        direction: delta >= 0 ? "up" : "down",
        confidenceOutOf100: Math.floor(50 + Math.random() * 40),
        note: "Fallback adjustment"
      };
    });
  }
}

export function mergePrices(baselines, aiList, weightAi = 0.3) {
  const aiMap = Object.fromEntries(aiList.map(a => [a.name, a]));
  return baselines.map(b => {
    const ai = aiMap[b.name] ?? null;
    const aiAdj = ai?.aiAdjustedZmwPerKg ?? b.baselineZmwPerKg;
    const final = b.baselineZmwPerKg * (1 - weightAi) + aiAdj * weightAi;
    const delta = ((final - b.baselineZmwPerKg) / b.baselineZmwPerKg) * 100;
    return {
      name: b.name,
      finalZmwPerKg: Number(final.toFixed(2)),
      baselineZmwPerKg: Number(b.baselineZmwPerKg.toFixed(2)),
      deltaPercent: Number(delta.toFixed(2)),
      updated_at: new Date().toISOString(),
      note: ai?.note ?? "Merged baseline+AI"
    };
  });
}
