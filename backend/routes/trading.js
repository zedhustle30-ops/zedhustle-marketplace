const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const axios = require('axios');

// Market data cache
let marketDataCache = {};
let lastMarketUpdate = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Get market data
router.get('/market-data', auth, async (req, res) => {
  try {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (now - lastMarketUpdate < CACHE_DURATION && Object.keys(marketDataCache).length > 0) {
      return res.json({
        success: true,
        data: marketDataCache,
        cached: true,
        lastUpdate: new Date(lastMarketUpdate)
      });
    }
    
    // Fetch fresh market data
    const marketData = await fetchMarketData();
    marketDataCache = marketData;
    lastMarketUpdate = now;
    
    res.json({
      success: true,
      data: marketData,
      cached: false,
      lastUpdate: new Date(lastMarketUpdate)
    });
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'MARKET_001',
        message: 'Failed to fetch market data'
      }
    });
  }
});

// Get user portfolios
router.get('/portfolios', auth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ 
      user: req.user.id,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: portfolios
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PORTFOLIO_001',
        message: 'Failed to fetch portfolios'
      }
    });
  }
});

// Get specific portfolio
router.get('/portfolios/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PORTFOLIO_002',
          message: 'Portfolio not found'
        }
      });
    }
    
    // Update portfolio with latest market data
    if (Object.keys(marketDataCache).length > 0) {
      await portfolio.updatePositionPrices(marketDataCache);
    }
    
    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PORTFOLIO_003',
        message: 'Failed to fetch portfolio'
      }
    });
  }
});

// Create new portfolio
router.post('/portfolios', auth, async (req, res) => {
  try {
    const { name, description, initialBalance = 100000 } = req.body;
    
    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PORTFOLIO_004',
          message: 'Portfolio name is required'
        }
      });
    }
    
    // Check if user already has a portfolio with this name
    const existingPortfolio = await Portfolio.findOne({
      user: req.user.id,
      name: name.trim(),
      isActive: true
    });
    
    if (existingPortfolio) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PORTFOLIO_005',
          message: 'Portfolio with this name already exists'
        }
      });
    }
    
    // Check if this is the user's first portfolio
    const portfolioCount = await Portfolio.countDocuments({
      user: req.user.id,
      isActive: true
    });
    
    const portfolio = new Portfolio({
      user: req.user.id,
      name: name.trim(),
      description: description?.trim(),
      virtualBalance: initialBalance,
      totalValue: initialBalance,
      isDefault: portfolioCount === 0 // First portfolio is default
    });
    
    await portfolio.save();
    
    // Update user's trading account
    await User.findByIdAndUpdate(req.user.id, {
      $push: { 'tradingAccount.portfolios': portfolio._id }
    });
    
    res.status(201).json({
      success: true,
      data: portfolio,
      message: 'Portfolio created successfully'
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PORTFOLIO_006',
        message: 'Failed to create portfolio'
      }
    });
  }
});

// Execute trade
router.post('/trade', auth, async (req, res) => {
  try {
    const { 
      portfolioId, 
      symbol, 
      name, 
      type, 
      action, // 'buy' or 'sell'
      quantity, 
      price,
      leverage = 1 
    } = req.body;
    
    // Validate input
    if (!portfolioId || !symbol || !action || !quantity || !price) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TRADE_001',
          message: 'Missing required trade parameters'
        }
      });
    }
    
    if (!['buy', 'sell'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TRADE_002',
          message: 'Invalid trade action. Must be buy or sell'
        }
      });
    }
    
    if (quantity <= 0 || price <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TRADE_003',
          message: 'Quantity and price must be positive numbers'
        }
      });
    }
    
    // Get portfolio
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: req.user.id,
      isActive: true
    });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TRADE_004',
          message: 'Portfolio not found'
        }
      });
    }
    
    let result;
    
    if (action === 'buy') {
      result = await portfolio.addPosition(symbol, name, type, quantity, price, leverage);
    } else {
      result = await portfolio.closePosition(symbol, quantity, price);
    }
    
    // Calculate updated performance
    await portfolio.calculatePerformance();
    
    res.json({
      success: true,
      data: result,
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} order executed successfully`
    });
  } catch (error) {
    console.error('Execute trade error:', error);
    
    if (error.message.includes('Insufficient balance') || 
        error.message.includes('Position not found') ||
        error.message.includes('Cannot sell more')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TRADE_005',
          message: error.message
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'TRADE_006',
        message: 'Failed to execute trade'
      }
    });
  }
});

// Get trading history
router.get('/history/:portfolioId', auth, async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { page = 1, limit = 20, type } = req.query;
    
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: req.user.id
    });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HISTORY_001',
          message: 'Portfolio not found'
        }
      });
    }
    
    let transactions = portfolio.transactions;
    
    // Filter by type if specified
    if (type && ['buy', 'sell'].includes(type)) {
      transactions = transactions.filter(t => t.type === type);
    }
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = transactions.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(transactions.length / limit),
          totalTransactions: transactions.length,
          hasNext: endIndex < transactions.length,
          hasPrev: startIndex > 0
        }
      }
    });
  } catch (error) {
    console.error('Get trading history error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'HISTORY_002',
        message: 'Failed to fetch trading history'
      }
    });
  }
});

// Get portfolio performance
router.get('/performance/:portfolioId', auth, async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { period = '30d' } = req.query;
    
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: req.user.id
    });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PERFORMANCE_001',
          message: 'Portfolio not found'
        }
      });
    }
    
    // Calculate performance metrics
    await portfolio.calculatePerformance();
    
    // Get historical data based on period
    const startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    const historicalTransactions = portfolio.transactions.filter(
      t => new Date(t.date) >= startDate
    );
    
    res.json({
      success: true,
      data: {
        performance: portfolio.performance,
        summary: {
          totalValue: portfolio.totalValue,
          totalReturn: portfolio.totalReturn,
          totalReturnPercentage: portfolio.totalReturnPercentage,
          availableBalance: portfolio.availableBalance,
          positionCount: portfolio.positionCount
        },
        historicalTransactions,
        period
      }
    });
  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PERFORMANCE_002',
        message: 'Failed to fetch performance data'
      }
    });
  }
});

// Update portfolio settings
router.put('/portfolios/:id/settings', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { riskSettings, name, description } = req.body;
    
    const portfolio = await Portfolio.findOne({
      _id: id,
      user: req.user.id
    });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SETTINGS_001',
          message: 'Portfolio not found'
        }
      });
    }
    
    // Update fields if provided
    if (name) portfolio.name = name.trim();
    if (description !== undefined) portfolio.description = description?.trim();
    if (riskSettings) {
      portfolio.riskSettings = { ...portfolio.riskSettings, ...riskSettings };
    }
    
    await portfolio.save();
    
    res.json({
      success: true,
      data: portfolio,
      message: 'Portfolio settings updated successfully'
    });
  } catch (error) {
    console.error('Update portfolio settings error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SETTINGS_002',
        message: 'Failed to update portfolio settings'
      }
    });
  }
});

// Helper function to fetch market data
async function fetchMarketData() {
  const marketData = {};
  
  try {
    // Simulated market data for development
    // In production, this would fetch from real APIs like Alpha Vantage, Yahoo Finance, etc.
    
    // Forex rates (against ZMW)
    marketData['USD/ZMW'] = {
      symbol: 'USD/ZMW',
      name: 'US Dollar to Zambian Kwacha',
      price: 25.50 + (Math.random() - 0.5) * 0.5,
      change: (Math.random() - 0.5) * 0.2,
      changePercent: (Math.random() - 0.5) * 2,
      volume: Math.floor(Math.random() * 1000000),
      type: 'forex'
    };
    
    marketData['EUR/ZMW'] = {
      symbol: 'EUR/ZMW',
      name: 'Euro to Zambian Kwacha',
      price: 28.20 + (Math.random() - 0.5) * 0.6,
      change: (Math.random() - 0.5) * 0.3,
      changePercent: (Math.random() - 0.5) * 2.5,
      volume: Math.floor(Math.random() * 800000),
      type: 'forex'
    };
    
    marketData['GBP/ZMW'] = {
      symbol: 'GBP/ZMW',
      name: 'British Pound to Zambian Kwacha',
      price: 32.10 + (Math.random() - 0.5) * 0.8,
      change: (Math.random() - 0.5) * 0.4,
      changePercent: (Math.random() - 0.5) * 3,
      volume: Math.floor(Math.random() * 600000),
      type: 'forex'
    };
    
    // Commodities
    marketData['GOLD'] = {
      symbol: 'GOLD',
      name: 'Gold',
      price: 2050.00 + (Math.random() - 0.5) * 50,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 2,
      volume: Math.floor(Math.random() * 500000),
      type: 'commodity'
    };
    
    marketData['COPPER'] = {
      symbol: 'COPPER',
      name: 'Copper',
      price: 8.45 + (Math.random() - 0.5) * 0.5,
      change: (Math.random() - 0.5) * 0.2,
      changePercent: (Math.random() - 0.5) * 3,
      volume: Math.floor(Math.random() * 2000000),
      type: 'commodity'
    };
    
    marketData['OIL'] = {
      symbol: 'OIL',
      name: 'Crude Oil',
      price: 75.30 + (Math.random() - 0.5) * 5,
      change: (Math.random() - 0.5) * 2,
      changePercent: (Math.random() - 0.5) * 4,
      volume: Math.floor(Math.random() * 1500000),
      type: 'commodity'
    };
    
    // Add timestamps
    Object.keys(marketData).forEach(symbol => {
      marketData[symbol].timestamp = new Date();
      marketData[symbol].change = Math.round(marketData[symbol].change * 10000) / 10000;
      marketData[symbol].changePercent = Math.round(marketData[symbol].changePercent * 100) / 100;
      marketData[symbol].price = Math.round(marketData[symbol].price * 10000) / 10000;
    });
    
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
  
  return marketData;
}

module.exports = router;
