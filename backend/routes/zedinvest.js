const express = require('express');
const router = express.Router();
const ZedInvestBusiness = require('../models/ZedInvestBusiness');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');

// Get all active businesses
router.get('/businesses', async (req, res) => {
  try {
    const { category, sort = 'newest', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { status: 'active' };
    if (category) filter.category = category;
    
    // Build sort
    let sortObj = {};
    switch (sort) {
      case 'funding':
        sortObj = { 'performance.fundingProgress': -1 };
        break;
      case 'return':
        sortObj = { expectedReturn: -1 };
        break;
      case 'rating':
        sortObj = { 'performance.averageRating': -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }
    
    const businesses = await ZedInvestBusiness.find(filter)
      .populate('owner', 'profile.firstName profile.lastName')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await ZedInvestBusiness.countDocuments(filter);
    
    res.json({
      success: true,
      data: businesses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get featured businesses
router.get('/businesses/featured', async (req, res) => {
  try {
    const businesses = await ZedInvestBusiness.getFeaturedBusinesses();
    
    res.json({
      success: true,
      data: businesses
    });
  } catch (error) {
    console.error('Error fetching featured businesses:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get single business with detailed info
router.get('/businesses/:id', async (req, res) => {
  try {
    const business = await ZedInvestBusiness.findById(req.params.id)
      .populate('owner', 'profile.firstName profile.lastName')
      .populate('investors.user', 'profile.firstName profile.lastName profileImage')
      .populate('reviews.user', 'profile.firstName profile.lastName');
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: { code: 'BUSINESS_001', message: 'Business not found' }
      });
    }
    
    res.json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Invest in a business
router.post('/businesses/:id/invest', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVEST_001', message: 'Invalid amount' }
      });
    }
    
    const business = await ZedInvestBusiness.findById(req.params.id);
    
    if (!business || business.status !== 'active') {
      return res.status(404).json({
        success: false,
        error: { code: 'BUSINESS_001', message: 'Business not found or not active' }
      });
    }
    
    // Check minimum and maximum investment
    if (amount < business.minInvestment) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVEST_002', message: `Minimum investment is K${business.minInvestment}` }
      });
    }
    
    if (amount > business.maxInvestment) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVEST_003', message: `Maximum investment is K${business.maxInvestment}` }
      });
    }
    
    // Check if user has enough balance
    if (req.user.wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVEST_004', message: 'Insufficient wallet balance' }
      });
    }
    
    // Calculate tokens to receive
    const tokensToReceive = Math.floor(amount / business.tokenPrice);
    
    if (tokensToReceive > business.tokensAvailable) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVEST_005', message: 'Not enough tokens available' }
      });
    }
    
    // Deduct from wallet
    req.user.wallet.balance -= amount;
    await req.user.save();
    
    // Add investor to business
    await business.addInvestor(req.user._id, tokensToReceive, amount);
    
    // Get or create investment portfolio
    let portfolio = await Portfolio.findOne({ user: req.user._id, type: 'investment' });
    
    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user._id,
        type: 'investment',
        balance: 0,
        positions: []
      });
    }
    
    // Add position to portfolio
    const existingPosition = portfolio.positions.find(p => p.token.toString() === business._id.toString());
    
    if (existingPosition) {
      existingPosition.quantity += tokensToReceive;
      existingPosition.averagePrice = ((existingPosition.quantity * existingPosition.averagePrice) + amount) / (existingPosition.quantity + tokensToReceive);
      existingPosition.lastUpdated = new Date();
    } else {
      portfolio.positions.push({
        token: business._id,
        quantity: tokensToReceive,
        averagePrice: business.tokenPrice,
        lastUpdated: new Date()
      });
    }
    
    await portfolio.save();
    
    // Create transaction
    const transaction = new Transaction({
      user: req.user._id,
      type: 'investment',
      amount,
      currency: 'ZMW',
      description: `Investment in ${business.name}`,
      metadata: {
        businessId: business._id,
        tokensReceived: tokensToReceive,
        tokenPrice: business.tokenPrice
      }
    });
    await transaction.save();
    
    // Add to user's wallet transactions
    req.user.wallet.transactions.push(transaction._id);
    await req.user.save();
    
    // Update user stats
    req.user.updateStats('investments', 1);
    await req.user.save();
    
    // Send notification
    await Message.sendInvestmentUpdate(req.user._id, business._id, 'investment', `You have successfully invested K${amount} in ${business.name}`);
    
    res.json({
      success: true,
      data: {
        business,
        tokensReceived: tokensToReceive,
        transaction,
        newBalance: req.user.wallet.balance
      },
      message: 'Investment successful'
    });
    
  } catch (error) {
    console.error('Error making investment:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get user's investment portfolio
router.get('/portfolio', authenticateToken, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id, type: 'investment' });
    
    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user._id,
        type: 'investment',
        balance: 0,
        positions: []
      });
      await portfolio.save();
    }
    
    // Populate business data for positions
    await portfolio.populate('positions.token');
    
    // Calculate total value and returns
    let totalValue = 0;
    let totalInvested = 0;
    
    for (const position of portfolio.positions) {
      const business = await ZedInvestBusiness.findById(position.token);
      if (business) {
        const positionValue = position.quantity * business.tokenPrice;
        totalValue += positionValue;
        totalInvested += position.quantity * position.averagePrice;
      }
    }
    
    const totalReturn = totalValue - totalInvested;
    const returnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
    
    res.json({
      success: true,
      data: {
        portfolio,
        totalValue,
        totalInvested,
        totalReturn,
        returnPercent
      }
    });
  } catch (error) {
    console.error('Error fetching investment portfolio:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Add review to business
router.post('/businesses/:id/review', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: { code: 'REVIEW_001', message: 'Invalid rating' }
      });
    }
    
    const business = await ZedInvestBusiness.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: { code: 'BUSINESS_001', message: 'Business not found' }
      });
    }
    
    await business.addReview(req.user._id, rating, comment);
    
    res.json({
      success: true,
      data: business,
      message: 'Review added successfully'
    });
    
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get investment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find({
      user: req.user._id,
      type: 'investment'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('metadata.businessId');
    
    const total = await Transaction.countDocuments({
      user: req.user._id,
      type: 'investment'
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
    console.error('Error fetching investment history:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get user's invested businesses
router.get('/my-investments', authenticateToken, async (req, res) => {
  try {
    const businesses = await ZedInvestBusiness.find({
      'investors.user': req.user._id
    })
    .populate('owner', 'profile.firstName profile.lastName')
    .sort({ createdAt: -1 });
    
    const investments = businesses.map(business => {
      const investment = business.investors.find(inv => inv.user.toString() === req.user._id.toString());
      return {
        business: {
          _id: business._id,
          name: business.name,
          category: business.category,
          location: business.location,
          tokenPrice: business.tokenPrice,
          expectedReturn: business.expectedReturn,
          performance: business.performance
        },
        investment: {
          tokensOwned: investment.tokensOwned,
          totalInvested: investment.totalInvested,
          dividendsReceived: investment.dividendsReceived,
          investedAt: investment.investedAt
        }
      };
    });
    
    res.json({
      success: true,
      data: investments
    });
  } catch (error) {
    console.error('Error fetching user investments:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Create new business (for business owners)
router.post('/businesses', authenticateToken, async (req, res) => {
  try {
    const businessData = {
      ...req.body,
      owner: req.user._id
    };
    
    const business = new ZedInvestBusiness(businessData);
    await business.save();
    
    res.status(201).json({
      success: true,
      data: business,
      message: 'Business created successfully'
    });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Update business (owner only)
router.put('/businesses/:id', authenticateToken, async (req, res) => {
  try {
    const business = await ZedInvestBusiness.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: { code: 'BUSINESS_001', message: 'Business not found' }
      });
    }
    
    // Check if user is the owner
    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Only the business owner can update this business' }
      });
    }
    
    Object.assign(business, req.body);
    await business.save();
    
    res.json({
      success: true,
      data: business,
      message: 'Business updated successfully'
    });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Add business update (owner only)
router.post('/businesses/:id/updates', authenticateToken, async (req, res) => {
  try {
    const { title, content, type } = req.body;
    
    const business = await ZedInvestBusiness.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: { code: 'BUSINESS_001', message: 'Business not found' }
      });
    }
    
    // Check if user is the owner
    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Only the business owner can add updates' }
      });
    }
    
    await business.addUpdate({ title, content, type });
    
    // Send notification to all investors
    for (const investor of business.investors) {
      await Message.sendInvestmentUpdate(investor.user, business._id, 'update', `New update from ${business.name}: ${title}`);
    }
    
    res.json({
      success: true,
      data: business,
      message: 'Update added successfully'
    });
  } catch (error) {
    console.error('Error adding business update:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

module.exports = router; 