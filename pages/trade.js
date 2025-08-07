/**
 * Simple Next.js page that subscribes to Supabase realtime updates
 * and displays the list of resources/prices.
 */

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function TradePage() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchInitial();

    const channel = supabase
      .channel('public:resources')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resources' },
        payload => {
          // payload contains .eventType and .new/.old
          // We'll fetch all for simplicity (or you can patch state using payload.new)
          fetchInitial();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchInitial() {
    const { data, error } = await supabase.from("resources").select("*").order("name", { ascending: true });
    if (error) {
      console.error("Fetch resources error:", error);
      return;
    }
    setResources(data || []);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>ZedHustle — Live Commodity Prices (AI + Market)</h1>
      <p style={{ marginBottom: 18, color: "#666" }}>Prices are a blend of market data and AI adjustments.</p>
      <div>
        {resources.map(r => (
          <div key={r.name} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
            <strong style={{ fontSize: 16 }}>{r.name}</strong>
            <div style={{ marginTop: 6 }}>
              <span style={{ fontSize: 18 }}>K{Number(r.price).toFixed(2)} / kg</span>
              <span style={{ marginLeft: 12, color: r.delta_percent >= 0 ? "green" : "red" }}>
                {r.delta_percent >= 0 ? "▲" : "▼"} {Math.abs(Number(r.delta_percent)).toFixed(2)}%
              </span>
            </div>
            <div style={{ marginTop: 6, color: "#888" }}>
              <small>{r.note} • updated {new Date(r.updated_at).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
