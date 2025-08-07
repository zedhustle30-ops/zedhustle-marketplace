/**
 * Server-side API route to:
 * 1) fetch baseline commodity prices (USD -> ZMW)
 * 2) call OpenAI for adjustments
 * 3) merge baseline + AI
 * 4) upsert final prices into Supabase (resources table)
 *
 * This file should run server-side only and use SUPABASE_SERVICE_ROLE_KEY.
 */

import { buildBaselinePrices, getAIAdjustedPrices, mergePrices } from "../../utils/combinedPriceFeed";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // server-side only
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 1. Build baseline
    const baselines = await buildBaselinePrices();

    if (!baselines.length) {
      return res.status(500).json({ error: "No baselines returned" });
    }

    // 2. Ask AI for adjustments
    const aiList = await getAIAdjustedPrices(baselines);

    // 3. Merge
    const finalPrices = mergePrices(baselines, aiList, 0.3);

    // 4. Upsert into Supabase resources table
    for (const p of finalPrices) {
      const { name, finalZmwPerKg, baselineZmwPerKg, deltaPercent, updated_at, note } = p;
      const { error } = await supabase
        .from("resources")
        .upsert(
          {
            name,
            price: finalZmwPerKg,
            baseline_price: baselineZmwPerKg,
            delta_percent: deltaPercent,
            note,
            updated_at
          },
          { onConflict: "name" }
        );
      if (error) console.error("Supabase upsert error:", error);
    }

    return res.status(200).json({ ok: true, updated: finalPrices });
  } catch (err) {
    console.error("update-prices error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
