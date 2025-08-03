const mongoose = require('mongoose');

const zedForexTokenSchema = new mongoose.Schema({
  // Token Information
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  commodity: {
    type: String,
    required: true,
    enum: ['copper', 'gold', 'maize', 'mealie_meal', 'oil']
  },
  description: String,
  
  // Pricing Information
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  previousPrice: {
    type: Number,
    required: true,
    min: 0
  },
  priceChange: {
    type: Number,
    default: 0
  },
  priceChangePercent: {
    type: Number,
    default: 0
  },
  
  // Market Data
  marketCap: {
    type: Number,
    default: 0
  },
  volume24h: {
    type: Number,
    default: 0
  },
  high24h: {
    type: Number,
    default: 0
  },
  low24h: {
    type: Number,
    default: 0
  },
  
  // Supply Information
  totalSupply: {
    type: Number,
    required: true,
    min: 0
  },
  circulatingSupply: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Trading Information
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Commodity Specific Data
  commodityData: {
    unit: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Price History
  priceHistory: [{
    price: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Trading Statistics
  tradingStats: {
    totalTrades: {
      type: Number,
      default: 0
    },
    totalVolume: {
      type: Number,
      default: 0
    },
    averageTradeSize: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Virtual for price change
zedForexTokenSchema.virtual('priceChangeFormatted').get(function() {
  return this.priceChange >= 0 ? `+${this.priceChange.toFixed(2)}` : this.priceChange.toFixed(2);
});

// Virtual for price change percent formatted
zedForexTokenSchema.virtual('priceChangePercentFormatted').get(function() {
  return this.priceChangePercent >= 0 ? `+${this.priceChangePercent.toFixed(2)}%` : `${this.priceChangePercent.toFixed(2)}%`;
});

// Method to update price
zedForexTokenSchema.methods.updatePrice = function(newPrice) {
  this.previousPrice = this.currentPrice;
  this.currentPrice = newPrice;
  this.priceChange = this.currentPrice - this.previousPrice;
  this.priceChangePercent = this.previousPrice > 0 ? 
    ((this.priceChange / this.previousPrice) * 100) : 0;
  
  // Update 24h high/low
  if (newPrice > this.high24h || this.high24h === 0) {
    this.high24h = newPrice;
  }
  if (newPrice < this.low24h || this.low24h === 0) {
    this.low24h = newPrice;
  }
  
  // Add to price history (keep last 100 entries)
  this.priceHistory.push({
    price: newPrice,
    timestamp: new Date()
  });
  
  if (this.priceHistory.length > 100) {
    this.priceHistory = this.priceHistory.slice(-100);
  }
  
  this.commodityData.lastUpdated = new Date();
  
  return this.save();
};

// Method to get price trend
zedForexTokenSchema.methods.getPriceTrend = function() {
  if (this.priceHistory.length < 2) return 'neutral';
  
  const recent = this.priceHistory.slice(-10);
  const firstPrice = recent[0].price;
  const lastPrice = recent[recent.length - 1].price;
  
  if (lastPrice > firstPrice * 1.02) return 'up';
  if (lastPrice < firstPrice * 0.98) return 'down';
  return 'neutral';
};

// Method to calculate volatility
zedForexTokenSchema.methods.calculateVolatility = function() {
  if (this.priceHistory.length < 2) return 0;
  
  const prices = this.priceHistory.slice(-30).map(p => p.price);
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  
  return Math.sqrt(variance);
};

// Static method to get all active tokens
zedForexTokenSchema.statics.getActiveTokens = function() {
  return this.find({ isActive: true }).sort({ symbol: 1 });
};

// Static method to get featured tokens
zedForexTokenSchema.statics.getFeaturedTokens = function() {
  return this.find({ isFeatured: true, isActive: true }).sort({ symbol: 1 });
};

// Static method to update all prices (for external API integration)
zedForexTokenSchema.statics.updateAllPrices = async function(priceData) {
  const updatePromises = Object.keys(priceData).map(async (symbol) => {
    const token = await this.findOne({ symbol: symbol.toUpperCase() });
    if (token) {
      await token.updatePrice(priceData[symbol]);
    }
  });
  
  return Promise.all(updatePromises);
};

// Ensure virtuals are serialized
zedForexTokenSchema.set('toJSON', { virtuals: true });
zedForexTokenSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ZedForexToken', zedForexTokenSchema); 