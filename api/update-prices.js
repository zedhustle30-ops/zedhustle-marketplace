// Vercel serverless function for AI-powered commodity price updates
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get current commodity prices
    const { data: commodities, error: fetchError } = await supabase
      .from('commodities')
      .select('*');

    if (fetchError) {
      console.error('Error fetching commodities:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch commodities' });
    }

    // Simulate AI-powered price changes
    const updatedCommodities = commodities.map(commodity => {
      const basePrice = commodity.current_price;
      
      // Generate realistic price changes based on commodity type
      let changePercent = 0;
      
      switch (commodity.name.toLowerCase()) {
        case 'copper':
          // Copper: -3% to +5%
          changePercent = (Math.random() - 0.4) * 8;
          break;
        case 'gold':
          // Gold: -2% to +3%
          changePercent = (Math.random() - 0.35) * 5;
          break;
        case 'maize':
          // Maize: -1% to +2%
          changePercent = (Math.random() - 0.33) * 3;
          break;
        case 'oil':
          // Oil: -4% to +6%
          changePercent = (Math.random() - 0.4) * 10;
          break;
        case 'diamonds':
          // Diamonds: -1% to +2%
          changePercent = (Math.random() - 0.33) * 3;
          break;
        default:
          changePercent = (Math.random() - 0.5) * 4;
      }

      const newPrice = basePrice * (1 + changePercent / 100);
      
      return {
        id: commodity.id,
        current_price: Math.round(newPrice * 100) / 100,
        change_percent: Math.round(changePercent * 100) / 100,
        last_updated: new Date().toISOString()
      };
    });

    // Update all commodities in batch
    const { error: updateError } = await supabase
      .from('commodities')
      .upsert(updatedCommodities);

    if (updateError) {
      console.error('Error updating commodities:', updateError);
      return res.status(500).json({ error: 'Failed to update commodities' });
    }

    // Log price history
    const priceHistory = updatedCommodities.map(commodity => ({
      commodity: commodity.name,
      price: commodity.current_price,
      recorded_at: new Date().toISOString()
    }));

    const { error: historyError } = await supabase
      .from('commodity_prices')
      .insert(priceHistory);

    if (historyError) {
      console.error('Error logging price history:', historyError);
    }

    console.log('✅ Commodity prices updated successfully');
    console.log('Updated prices:', updatedCommodities);

    return res.status(200).json({
      message: 'Prices updated successfully',
      updated: updatedCommodities.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in price update function:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 