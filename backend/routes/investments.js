const express = require('express');
const Investment = require('../models/Investment');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all investment opportunities
router.get('/', async (req, res) => {
  try {
    const {
      category,
      status = 'active', 
      minAmount, 
      maxAmount, 
      riskLevel,
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = { status };

    if (category) filter.category = category;
    if (riskLevel) filter.riskLevel = riskLevel;
    if (minAmount || maxAmount) {
      filter['funding.goal'] = {};
      if (minAmount) filter['funding.goal'].$gte = Number(minAmount);
      if (maxAmount) filter['funding.goal'].$lte = Number(maxAmount);
    }

    const skip = (page - 1) * limit;
    
    const investments = await Investment.find(filter)
      .populate('owner', 'profile.firstName profile.lastName profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Investment.countDocuments(filter);

    res.json({
      success: true,
      data: {
        investments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Get featured investments
router.get('/featured', async (req, res) => {
  try {
    const investments = await Investment.find({ 
      featured: true, 
      status: 'active' 
    })
    .populate('owner', 'profile.firstName profile.lastName profile.avatar')
    .limit(6);

    res.json({
      success: true,
      data: investments
    });

  } catch (error) {
    console.error('Get featured investments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Get single investment
router.get('/:id', async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id)
      .populate('owner', 'profile.firstName profile.lastName profile.avatar profile.phone')
      .populate('investors.user', 'profile.firstName profile.lastName');

    if (!investment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'INVESTMENT_001',
          message: 'Investment not found'
        }
      });
    }

    res.json({
      success: true,
      data: investment
    });

  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Create new investment (business owners only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.role !== 'business_owner' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_002',
          message: 'Only business owners can create investments'
        }
      });
    }

    const {
      businessName,
      description,
      category,
      location,
      funding,
      returns,
      riskLevel,
      documents,
      deadline
    } = req.body;

    const investment = new Investment({
      businessName,
      description,
      category,
      location,
      funding,
      returns,
      riskLevel,
      documents,
      deadline: new Date(deadline),
      owner: user._id
    });

    await investment.save();

    res.status(201).json({
      success: true,
      data: investment,
      message: 'Investment created successfully'
    });

  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Invest in an opportunity
router.post('/:id/invest', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'INVESTMENT_001',
          message: 'Investment not found'
        }
      });
    }

    if (investment.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVESTMENT_002',
          message: 'Investment is not active'
        }
      });
    }

    if (amount < investment.funding.minimum) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVESTMENT_003',
          message: `Minimum investment amount is K${investment.funding.minimum}`
        }
      });
    }

    // Check if user already invested
    const existingInvestment = investment.investors.find(
      inv => inv.user.toString() === req.user._id.toString()
    );

    if (existingInvestment) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVESTMENT_004',
          message: 'You have already invested in this opportunity'
        }
      });
    }

    // Add investor
    investment.investors.push({
      user: req.user._id,
      amount,
      percentage: investment.returns.type === 'equity' ? (amount / investment.funding.goal) * 100 : 0,
      date: new Date()
    });

    investment.funding.current += amount;

    // Check if funding goal reached
    if (investment.funding.current >= investment.funding.goal) {
      investment.status = 'funded';
    }

    await investment.save();

    res.json({
      success: true,
      data: investment,
      message: 'Investment successful'
    });

  } catch (error) {
    console.error('Invest error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Get user's investments
router.get('/user/my-investments', authenticateToken, async (req, res) => {
  try {
    const investments = await Investment.find({
      'investors.user': req.user._id
    })
    .populate('owner', 'profile.firstName profile.lastName')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: investments
    });

  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Get user's created investments (business owners)
router.get('/user/created', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.role !== 'business_owner' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_002',
          message: 'Only business owners can view created investments'
        }
      });
    }

    const investments = await Investment.find({ owner: req.user._id })
      .populate('investors.user', 'profile.firstName profile.lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: investments
    });

  } catch (error) {
    console.error('Get created investments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

module.exports = router;
