const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');

// Get user's referral code
router.get('/code', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referrals: user.referrals,
        totalEarned: user.referrals.reduce((sum, ref) => sum + ref.earned, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching referral code:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get user's referral statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const totalReferrals = user.referrals.length;
    const totalEarned = user.referrals.reduce((sum, ref) => sum + ref.earned, 0);
    const thisMonthReferrals = user.referrals.filter(ref => {
      const refDate = new Date(ref.date);
      const now = new Date();
      return refDate.getMonth() === now.getMonth() && refDate.getFullYear() === now.getFullYear();
    });
    
    res.json({
      success: true,
      data: {
        totalReferrals,
        totalEarned,
        thisMonthReferrals: thisMonthReferrals.length,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get user's referral history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const user = await User.findById(req.user._id).populate('referrals.user', 'profile.firstName profile.lastName email createdAt');
    
    const referrals = user.referrals
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(skip, skip + parseInt(limit));
    
    const total = user.referrals.length;
    
    res.json({
      success: true,
      data: referrals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching referral history:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Process referral signup
router.post('/process', async (req, res) => {
  try {
    const { referralCode, newUserId } = req.body;
    
    if (!referralCode || !newUserId) {
      return res.status(400).json({
        success: false,
        error: { code: 'REFERRAL_001', message: 'Referral code and new user ID are required' }
      });
    }
    
    // Find the referrer
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({
        success: false,
        error: { code: 'REFERRAL_002', message: 'Invalid referral code' }
      });
    }
    
    // Check if new user exists
    const newUser = await User.findById(newUserId);
    if (!newUser) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_001', message: 'New user not found' }
      });
    }
    
    // Check if user already has a referrer
    if (newUser.referredBy) {
      return res.status(400).json({
        success: false,
        error: { code: 'REFERRAL_003', message: 'User already has a referrer' }
      });
    }
    
    // Check if user is referring themselves
    if (referrer._id.toString() === newUser._id.toString()) {
      return res.status(400).json({
        success: false,
        error: { code: 'REFERRAL_004', message: 'Cannot refer yourself' }
      });
    }
    
    // Update new user with referrer
    newUser.referredBy = referrer._id;
    await newUser.save();
    
    // Add referral to referrer's list
    referrer.referrals.push({
      user: newUser._id,
      earned: 5, // K5 reward
      date: new Date()
    });
    await referrer.save();
    
    // Add K5 to referrer's wallet
    referrer.wallet.balance += 5;
    await referrer.save();
    
    // Create transaction for referrer
    const referrerTransaction = new Transaction({
      user: referrer._id,
      type: 'referral_bonus',
      amount: 5,
      currency: 'ZMW',
      description: `Referral bonus for ${newUser.profile.firstName} ${newUser.profile.lastName}`,
      metadata: {
        referredUser: newUser._id,
        referralCode
      }
    });
    await referrerTransaction.save();
    
    // Add to referrer's wallet transactions
    referrer.wallet.transactions.push(referrerTransaction._id);
    await referrer.save();
    
    // Send notification to referrer
    await Message.sendSystemNotification(
      [referrer._id],
      'Referral Bonus Earned!',
      `You earned K5 for referring ${newUser.profile.firstName} ${newUser.profile.lastName}`,
      { type: 'referral_bonus', amount: 5 }
    );
    
    // Send welcome notification to new user
    await Message.sendSystemNotification(
      [newUser._id],
      'Welcome to ZedHustle!',
      `You were referred by ${referrer.profile.firstName} ${referrer.profile.lastName}. Welcome to the platform!`,
      { type: 'welcome', referrer: referrer._id }
    );
    
    res.json({
      success: true,
      data: {
        referrer: {
          _id: referrer._id,
          name: `${referrer.profile.firstName} ${referrer.profile.lastName}`,
          newBalance: referrer.wallet.balance
        },
        newUser: {
          _id: newUser._id,
          name: `${newUser.profile.firstName} ${newUser.profile.lastName}`
        },
        bonus: 5
      },
      message: 'Referral processed successfully'
    });
    
  } catch (error) {
    console.error('Error processing referral:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get top referrers (admin only)
router.get('/leaderboard', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Admin access required' }
      });
    }
    
    const topReferrers = await User.aggregate([
      {
        $match: {
          'referrals.0': { $exists: true } // Users with at least one referral
        }
      },
      {
        $project: {
          firstName: '$profile.firstName',
          lastName: '$profile.lastName',
          email: 1,
          referralCode: 1,
          referralCount: { $size: '$referrals' },
          totalEarned: {
            $reduce: {
              input: '$referrals',
              initialValue: 0,
              in: { $add: ['$$value', '$$this.earned'] }
            }
          }
        }
      },
      {
        $sort: { totalEarned: -1 }
      },
      {
        $limit: 20
      }
    ]);
    
    res.json({
      success: true,
      data: topReferrers
    });
  } catch (error) {
    console.error('Error fetching referral leaderboard:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get referral analytics (admin only)
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Admin access required' }
      });
    }
    
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        };
        break;
      case 'month':
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1)
        };
        break;
      case 'year':
        dateFilter = {
          $gte: new Date(now.getFullYear(), 0, 1)
        };
        break;
    }
    
    // Total referrals in period
    const totalReferrals = await User.aggregate([
      {
        $unwind: '$referrals'
      },
      {
        $match: {
          'referrals.date': dateFilter
        }
      },
      {
        $count: 'total'
      }
    ]);
    
    // Total earnings in period
    const totalEarnings = await User.aggregate([
      {
        $unwind: '$referrals'
      },
      {
        $match: {
          'referrals.date': dateFilter
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$referrals.earned' }
        }
      }
    ]);
    
    // New users with referrals
    const newUsersWithReferrals = await User.countDocuments({
      referredBy: { $exists: true },
      createdAt: dateFilter
    });
    
    res.json({
      success: true,
      data: {
        period,
        totalReferrals: totalReferrals[0]?.total || 0,
        totalEarnings: totalEarnings[0]?.total || 0,
        newUsersWithReferrals,
        adminRevenue: (totalReferrals[0]?.total || 0) * 25 // K25 per referral
      }
    });
  } catch (error) {
    console.error('Error fetching referral analytics:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

module.exports = router; 