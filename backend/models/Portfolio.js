const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  description: String,
  virtualBalance: { type: Number, default: 100000 },
  totalValue: { type: Number, default: 100000 },
  totalReturn: { type: Number, default: 0 },
  totalReturnPercentage: { type: Number, default: 0 },
  positions: [{
    symbol: String, // e.g., "USD/ZMW", "AAPL", "GOLD"
    name: String, // Full name
    type: { type: String, enum: ['forex', 'stock', 'commodity', 'crypto'] },
    quantity: Number,
    entryPrice: Number,
    currentPrice: Number,
    unrealizedPL: Number,
    unrealizedPLPercentage: Number,
    dateOpened: { type: Date, default: Date.now },
    stopLoss: Number,
    takeProfit: Number
  }],
  transactions: [{
    type: { type: String, enum: ['buy', 'sell'] },
    symbol: String,
    quantity: Number,
    price: Number,
    fee: Number,
    total: Number,
    date: { type: Date, default: Date.now }
  }],
  performance: {
    dailyReturn: Number,
    weeklyReturn: Number,
    monthlyReturn: Number,
    yearlyReturn: Number,
    maxDrawdown: Number,
    sharpeRatio: Number
  },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculate total portfolio value
PortfolioSchema.methods.calculateTotalValue = function() {
  let totalValue = this.virtualBalance;
  
  this.positions.forEach(position => {
    if (position.quantity && position.currentPrice) {
      totalValue += position.quantity * position.currentPrice;
    }
  });
  
  this.totalValue = totalValue;
  this.totalReturn = totalValue - 100000; // Assuming 100k starting balance
  this.totalReturnPercentage = ((this.totalReturn / 100000) * 100);
  
  return this.save();
};

// Add position to portfolio
PortfolioSchema.methods.addPosition = function(symbol, name, type, quantity, price) {
  const position = {
      symbol,
      name,
      type,
      quantity,
      entryPrice: price,
      currentPrice: price,
      unrealizedPL: 0,
    unrealizedPLPercentage: 0,
    dateOpened: new Date()
  };
  
  this.positions.push(position);
  this.virtualBalance -= (quantity * price);
  
  return this.save();
};

// Update position prices
PortfolioSchema.methods.updatePrices = function(marketData) {
  this.positions.forEach(position => {
    const marketPrice = marketData[position.symbol];
    if (marketPrice) {
      position.currentPrice = marketPrice;
      position.unrealizedPL = (marketPrice - position.entryPrice) * position.quantity;
      position.unrealizedPLPercentage = ((marketPrice - position.entryPrice) / position.entryPrice) * 100;
    }
  });
  
  return this.calculateTotalValue();
};

// Ensure virtual fields are serialized
PortfolioSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
