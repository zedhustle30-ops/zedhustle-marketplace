const express = require('express');
const router = express.Router();
const ZedForexToken = require('../models/ZedForexToken');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');

// Get all active tokens
router.get('/tokens', async (req, res) => {
  try {
    const tokens = await ZedForexToken.getActiveTokens();
    
    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get featured tokens
router.get('/tokens/featured', async (req, res) => {
  try {
    const tokens = await ZedForexToken.getFeaturedTokens();
    
    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error('Error fetching featured tokens:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get single token with detailed info
router.get('/tokens/:symbol', async (req, res) => {
  try {
    const token = await ZedForexToken.findOne({ 
      symbol: req.params.symbol.toUpperCase(),
      isActive: true 
    });
    
    if (!token) {
      return res.status(404).json({
        success: false,
        error: { code: 'TOKEN_001', message: 'Token not found' }
      });
    }
    
    res.json({
      success: true,
      data: token
    });
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get user's trading portfolio
router.get('/portfolio', authenticateToken, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id, type: 'trading' });
    
    if (!portfolio) {
      // Create default portfolio
      portfolio = new Portfolio({
        user: req.user._id,
        type: 'trading',
        balance: 100000, // Starting virtual balance
        positions: []
      });
      await portfolio.save();
    }
    
    // Populate token data for positions
    await portfolio.populate('positions.token');
    
    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Place a trade (buy/sell)
router.post('/trade', authenticateToken, async (req, res) => {
  try {
    const { symbol, action, quantity, price } = req.body;
    
    if (!symbol || !action || !quantity || !price) {
      return res.status(400).json({
        success: false,
        error: { code: 'TRADE_001', message: 'Missing required fields' }
      });
    }
    
    if (!['buy', 'sell'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: { code: 'TRADE_002', message: 'Invalid action' }
      });
    }
    
    // Get token
    const token = await ZedForexToken.findOne({ 
      symbol: symbol.toUpperCase(),
      isActive: true 
    });
    
    if (!token) {
      return res.status(404).json({
        success: false,
        error: { code: 'TOKEN_001', message: 'Token not found' }
      });
    }
    
    // Get or create portfolio
    let portfolio = await Portfolio.findOne({ user: req.user._id, type: 'trading' });
    
    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user._id,
        type: 'trading',
        balance: 100000,
        positions: []
      });
    }
    
    const totalValue = quantity * price;
    
    if (action === 'buy') {
      // Check if user has enough balance
      if (portfolio.balance < totalValue) {
        return res.status(400).json({
          success: false,
          error: { code: 'TRADE_003', message: 'Insufficient balance' }
        });
      }
      
      // Deduct balance
      portfolio.balance -= totalValue;
      
      // Add or update position
      const existingPosition = portfolio.positions.find(p => p.token.toString() === token._id.toString());
      
      if (existingPosition) {
        // Update existing position
        const newQuantity = existingPosition.quantity + quantity;
        const newAveragePrice = ((existingPosition.quantity * existingPosition.averagePrice) + totalValue) / newQuantity;
        
        existingPosition.quantity = newQuantity;
        existingPosition.averagePrice = newAveragePrice;
        existingPosition.lastUpdated = new Date();
      } else {
        // Add new position
        portfolio.positions.push({
          token: token._id,
          quantity,
          averagePrice: price,
          lastUpdated: new Date()
        });
      }
      
      // Update user stats
      req.user.updateStats('trades', 1);
      await req.user.save();
      
    } else if (action === 'sell') {
      // Check if user has enough tokens
      const existingPosition = portfolio.positions.find(p => p.token.toString() === token._id.toString());
      
      if (!existingPosition || existingPosition.quantity < quantity) {
        return res.status(400).json({
          success: false,
          error: { code: 'TRADE_004', message: 'Insufficient tokens' }
        });
      }
      
      // Add balance
      portfolio.balance += totalValue;
      
      // Update position
      existingPosition.quantity -= quantity;
      existingPosition.lastUpdated = new Date();
      
      // Remove position if quantity is 0
      if (existingPosition.quantity === 0) {
        portfolio.positions = portfolio.positions.filter(p => p.token.toString() !== token._id.toString());
      }
      
      // Calculate profit/loss
      const profitLoss = (price - existingPosition.averagePrice) * quantity;
      req.user.updateStats('trading_profit', profitLoss);
      await req.user.save();
    }
    
    await portfolio.save();
    
    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type: 'trade',
      amount: totalValue,
      currency: 'ZMW',
      description: `${action.toUpperCase()} ${quantity} ${symbol} at K${price}`,
      metadata: {
        symbol,
        action,
        quantity,
        price,
        tokenId: token._id
      }
    });
    await transaction.save();
    
    // Update token trading stats
    token.tradingStats.totalTrades += 1;
    token.tradingStats.totalVolume += totalValue;
    token.tradingStats.averageTradeSize = token.tradingStats.totalVolume / token.tradingStats.totalTrades;
    await token.save();
    
    res.json({
      success: true,
      data: {
        portfolio,
        transaction,
        message: `Trade executed successfully`
      }
    });
    
  } catch (error) {
    console.error('Error placing trade:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get trading history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find({
      user: req.user._id,
      type: 'trade'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('metadata.tokenId');
    
    const total = await Transaction.countDocuments({
      user: req.user._id,
      type: 'trade'
    });
    
    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching trading history:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get market data (simulated for now)
router.get('/market-data', async (req, res) => {
  try {
    const tokens = await ZedForexToken.getActiveTokens();
    
    // Simulate real-time price updates
    const marketData = tokens.map(token => ({
      symbol: token.symbol,
      name: token.name,
      price: token.currentPrice,
      change: token.priceChange,
      changePercent: token.priceChangePercent,
      volume: token.volume24h,
      high: token.high24h,
      low: token.low24h,
      trend: token.getPriceTrend(),
      volatility: token.calculateVolatility()
    }));
    
    res.json({
      success: true,
      data: marketData
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Withdraw trading profits to wallet
router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'WITHDRAW_001', message: 'Invalid amount' }
      });
    }
    
    // Get portfolio
    const portfolio = await Portfolio.findOne({ user: req.user._id, type: 'trading' });
    
    if (!portfolio || portfolio.balance < amount) {
      return res.status(400).json({
        success: false,
        error: { code: 'WITHDRAW_002', message: 'Insufficient balance' }
      });
    }
    
    // Deduct from portfolio
    portfolio.balance -= amount;
    await portfolio.save();
    
    // Add to wallet
    req.user.wallet.balance += amount;
    await req.user.save();
    
    // Create transaction
    const transaction = new Transaction({
      user: req.user._id,
      type: 'withdrawal',
      amount,
      currency: 'ZMW',
      description: `Withdrawal from trading account`,
      metadata: {
        source: 'trading',
        balanceBefore: portfolio.balance + amount,
        balanceAfter: portfolio.balance
      }
    });
    await transaction.save();
    
    // Add to user's wallet transactions
    req.user.wallet.transactions.push(transaction._id);
    await req.user.save();
    
    // Send notification
    await Message.sendPaymentConfirmation(req.user._id, transaction._id, amount, 'withdrawal');
    
    res.json({
      success: true,
      data: {
        newBalance: req.user.wallet.balance,
        portfolioBalance: portfolio.balance,
        transaction
      },
      message: 'Withdrawal successful'
    });
    
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get trading performance
router.get('/performance', authenticateToken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id, type: 'trading' });
    
    if (!portfolio) {
      return res.json({
        success: true,
        data: {
          totalValue: 0,
          totalProfit: 0,
          profitPercent: 0,
          totalTrades: 0,
          positions: []
        }
      });
    }
    
    // Calculate current portfolio value
    let totalValue = portfolio.balance;
    let totalCost = 0;
    
    for (const position of portfolio.positions) {
      const token = await ZedForexToken.findById(position.token);
      if (token) {
        const positionValue = position.quantity * token.currentPrice;
        totalValue += positionValue;
        totalCost += position.quantity * position.averagePrice;
      }
    }
    
    const totalProfit = totalValue - totalCost;
    const profitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    
    res.json({
      success: true,
      data: {
        totalValue,
        totalCost,
        totalProfit,
        profitPercent,
        totalTrades: req.user.stats.totalTrades,
        tradingProfit: req.user.stats.tradingProfit,
        positions: portfolio.positions
      }
    });
    
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

module.exports = router; 