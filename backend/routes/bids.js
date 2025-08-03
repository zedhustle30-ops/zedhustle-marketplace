const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');

// Get user's bid information
router.get('/info', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        available: user.bids.available,
        used: user.bids.used,
        purchased: user.bids.purchased,
        total: user.totalBids
      }
    });
  } catch (error) {
    console.error('Error fetching bid info:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Purchase additional bids
router.post('/purchase', authenticateToken, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'BID_001', message: 'Invalid bid amount' }
      });
    }
    
    // Calculate cost (K20 for 100 bids)
    const bidCost = Math.ceil(amount / 100) * 20; // K20 per 100 bids
    
    // Check if user has enough balance
    if (req.user.wallet.balance < bidCost) {
      return res.status(400).json({
        success: false,
        error: { code: 'BID_002', message: 'Insufficient wallet balance' }
      });
    }
    
    // Deduct from wallet
    req.user.wallet.balance -= bidCost;
    
    // Add purchased bids
    req.user.addBids(amount, 'purchased');
    
    await req.user.save();
    
    // Create transaction
    const transaction = new Transaction({
      user: req.user._id,
      type: 'bid_purchase',
      amount: bidCost,
      currency: 'ZMW',
      description: `Purchased ${amount} bids`,
      metadata: {
        bidsPurchased: amount,
        paymentMethod
      }
    });
    await transaction.save();
    
    // Add to user's wallet transactions
    req.user.wallet.transactions.push(transaction._id);
    await req.user.save();
    
    // Send notification
    await Message.sendSystemNotification(
      [req.user._id],
      'Bids Purchased Successfully!',
      `You have purchased ${amount} bids for K${bidCost}`,
      { type: 'bid_purchase', amount, cost: bidCost }
    );
    
    res.json({
      success: true,
      data: {
        bidsPurchased: amount,
        cost: bidCost,
        newBalance: req.user.wallet.balance,
        newBidCount: req.user.totalBids,
        transaction
      },
      message: 'Bids purchased successfully'
    });
    
  } catch (error) {
    console.error('Error purchasing bids:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Use bids for job application
router.post('/use', authenticateToken, async (req, res) => {
  try {
    const { jobId, bidCost } = req.body;
    
    if (!jobId || !bidCost) {
      return res.status(400).json({
        success: false,
        error: { code: 'BID_002', message: 'Job ID and bid cost are required' }
      });
    }
    
    // Check if user has enough bids
    if (req.user.bids.available < bidCost) {
      return res.status(400).json({
        success: false,
        error: { code: 'BID_003', message: 'Insufficient bids' }
      });
    }
    
    // Deduct bids
    const success = req.user.deductBids(bidCost);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        error: { code: 'BID_004', message: 'Failed to deduct bids' }
      });
    }
    
    await req.user.save();
    
    // Create transaction
    const transaction = new Transaction({
      user: req.user._id,
      type: 'bid_used',
      amount: 0, // No money involved, just bid usage
      currency: 'ZMW',
      description: `Used ${bidCost} bids for job application`,
      metadata: {
        jobId,
        bidsUsed: bidCost
      }
    });
    await transaction.save();
    
    res.json({
      success: true,
      data: {
        bidsUsed: bidCost,
        remainingBids: req.user.bids.available,
        totalBids: req.user.totalBids,
        transaction
      },
      message: 'Bids used successfully'
    });
    
  } catch (error) {
    console.error('Error using bids:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get bid usage history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find({
      user: req.user._id,
      type: { $in: ['bid_purchase', 'bid_used'] }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await Transaction.countDocuments({
      user: req.user._id,
      type: { $in: ['bid_purchase', 'bid_used'] }
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
    console.error('Error fetching bid history:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get bid statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get bid purchase transactions
    const purchaseTransactions = await Transaction.find({
      user: req.user._id,
      type: 'bid_purchase'
    });
    
    const totalPurchased = purchaseTransactions.reduce((sum, tx) => {
      return sum + (tx.metadata?.bidsPurchased || 0);
    }, 0);
    
    const totalSpent = purchaseTransactions.reduce((sum, tx) => {
      return sum + tx.amount;
    }, 0);
    
    // Get bid usage transactions
    const usageTransactions = await Transaction.find({
      user: req.user._id,
      type: 'bid_used'
    });
    
    const totalUsed = usageTransactions.reduce((sum, tx) => {
      return sum + (tx.metadata?.bidsUsed || 0);
    }, 0);
    
    res.json({
      success: true,
      data: {
        currentBids: user.totalBids,
        totalPurchased,
        totalUsed,
        totalSpent,
        freeBidsUsed: user.bids.used,
        purchasedBidsUsed: user.bids.purchased - (user.bids.purchased - totalUsed)
      }
    });
  } catch (error) {
    console.error('Error fetching bid stats:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Admin: Add bonus bids to user
router.post('/admin/add-bonus', authenticateToken, async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Admin access required' }
      });
    }
    
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'BID_005', message: 'User ID and valid amount are required' }
      });
    }
    
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_001', message: 'User not found' }
      });
    }
    
    // Add bonus bids
    targetUser.addBids(amount, 'available');
    await targetUser.save();
    
    // Send notification to user
    await Message.sendSystemNotification(
      [targetUser._id],
      'Bonus Bids Added!',
      `You have received ${amount} bonus bids${reason ? ` for: ${reason}` : ''}`,
      { type: 'bonus_bids', amount, reason }
    );
    
    res.json({
      success: true,
      data: {
        user: {
          _id: targetUser._id,
          name: `${targetUser.profile.firstName} ${targetUser.profile.lastName}`,
          newBidCount: targetUser.totalBids
        },
        bonusBids: amount,
        reason
      },
      message: 'Bonus bids added successfully'
    });
    
  } catch (error) {
    console.error('Error adding bonus bids:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get bid pricing information
router.get('/pricing', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        packages: [
          {
            id: 'small',
            name: 'Small Package',
            bids: 50,
            price: 10,
            pricePerBid: 0.2
          },
          {
            id: 'medium',
            name: 'Medium Package',
            bids: 100,
            price: 20,
            pricePerBid: 0.2
          },
          {
            id: 'large',
            name: 'Large Package',
            bids: 250,
            price: 45,
            pricePerBid: 0.18
          },
          {
            id: 'premium',
            name: 'Premium Package',
            bids: 500,
            price: 80,
            pricePerBid: 0.16
          }
        ],
        jobApplicationCosts: {
          entry: 5,
          mid: 10,
          specialized: 15
        }
      }
    });
  } catch (error) {
    console.error('Error fetching bid pricing:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get bid analytics (admin only)
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
    
    // Total bid purchases in period
    const totalPurchases = await Transaction.aggregate([
      {
        $match: {
          type: 'bid_purchase',
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalBids: { $sum: '$metadata.bidsPurchased' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Total bid usage in period
    const totalUsage = await Transaction.aggregate([
      {
        $match: {
          type: 'bid_used',
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalBids: { $sum: '$metadata.bidsUsed' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // User statistics
    const totalUsers = await User.countDocuments();
    const usersWithBids = await User.countDocuments({
      $or: [
        { 'bids.available': { $gt: 0 } },
        { 'bids.purchased': { $gt: 0 } }
      ]
    });
    
    res.json({
      success: true,
      data: {
        period,
        purchases: totalPurchases[0] || { totalAmount: 0, totalBids: 0, count: 0 },
        usage: totalUsage[0] || { totalBids: 0, count: 0 },
        users: {
          total: totalUsers,
          withBids: usersWithBids,
          percentage: totalUsers > 0 ? (usersWithBids / totalUsers) * 100 : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching bid analytics:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

module.exports = router; 