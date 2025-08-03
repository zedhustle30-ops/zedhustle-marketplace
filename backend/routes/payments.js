const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's wallet balance
router.get('/wallet', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        balance: user.wallet.balance,
        currency: user.wallet.currency,
        accountNumber: user.wallet.accountNumber
      }
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Deposit money
router.post('/deposit', authenticateToken, async (req, res) => {
  try {
    const { amount, paymentMethod, phoneNumber } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_001',
          message: 'Invalid amount'
        }
      });
    }

    if (!paymentMethod || !['airtel_money', 'mtn_money'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_002',
          message: 'Invalid payment method'
        }
      });
    }

    const user = await User.findById(req.user._id);

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type: 'deposit',
      amount,
      currency: 'ZMW',
      paymentMethod,
      paymentDetails: {
        phoneNumber,
        reference: `DEP-${Date.now()}`
      },
      balanceBefore: user.wallet.balance,
      balanceAfter: user.wallet.balance + amount
    });

    await transaction.save();

    // Update user's wallet balance
    user.wallet.balance += amount;
    user.wallet.transactions.push(transaction._id);
    await user.save();

    // Update transaction status to completed
    transaction.status = 'completed';
    transaction.processedAt = new Date();
    await transaction.save();

    res.json({
      success: true,
      data: {
        transaction,
        newBalance: user.wallet.balance
      },
      message: 'Deposit successful'
    });

  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Withdraw money
router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount, paymentMethod, phoneNumber } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_001',
          message: 'Invalid amount'
        }
      });
    }

    if (!paymentMethod || !['airtel_money', 'mtn_money'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_002',
          message: 'Invalid payment method'
        }
      });
    }

    const user = await User.findById(req.user._id);

    if (user.wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_003',
          message: 'Insufficient balance'
        }
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type: 'withdrawal',
      amount,
      currency: 'ZMW',
      paymentMethod,
      paymentDetails: {
        phoneNumber,
        reference: `WIT-${Date.now()}`
      },
      balanceBefore: user.wallet.balance,
      balanceAfter: user.wallet.balance - amount
    });

    await transaction.save();

    // Update user's wallet balance
    user.wallet.balance -= amount;
    user.wallet.transactions.push(transaction._id);
    await user.save();

    // Update transaction status to completed
    transaction.status = 'completed';
    transaction.processedAt = new Date();
    await transaction.save();

    res.json({
      success: true,
      data: {
        transaction,
        newBalance: user.wallet.balance
      },
      message: 'Withdrawal successful'
    });

  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Pay for investment
router.post('/invest', authenticateToken, async (req, res) => {
  try {
    const { amount, investmentId, paymentMethod, phoneNumber } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_001',
          message: 'Invalid amount'
        }
      });
    }

    if (!investmentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_004',
          message: 'Investment ID required'
        }
      });
    }

    const user = await User.findById(req.user._id);

    if (user.wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_003',
          message: 'Insufficient balance'
        }
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type: 'investment',
      amount,
      currency: 'ZMW',
      paymentMethod: paymentMethod || 'wallet',
      paymentDetails: {
        phoneNumber,
        reference: `INV-${Date.now()}`
      },
      metadata: {
        investmentId
      },
      balanceBefore: user.wallet.balance,
      balanceAfter: user.wallet.balance - amount
    });

    await transaction.save();

    // Update user's wallet balance
    user.wallet.balance -= amount;
    user.wallet.transactions.push(transaction._id);
    await user.save();

    // Update transaction status to completed
    transaction.status = 'completed';
    transaction.processedAt = new Date();
    await transaction.save();

    res.json({
      success: true,
      data: {
        transaction,
        newBalance: user.wallet.balance
      },
      message: 'Investment payment successful'
    });

  } catch (error) {
    console.error('Investment payment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Get payment methods
router.get('/methods', async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'airtel_money',
        name: 'Airtel Money',
        logo: '/images/airtel-money.png',
        description: 'Pay using Airtel Money',
        minAmount: 1,
        maxAmount: 50000
      },
      {
        id: 'mtn_money',
        name: 'MTN Mobile Money',
        logo: '/images/mtn-money.png',
        description: 'Pay using MTN Mobile Money',
        minAmount: 1,
        maxAmount: 50000
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        logo: '/images/bank-transfer.png',
        description: 'Pay via bank transfer',
        minAmount: 100,
        maxAmount: 1000000
      }
    ];

    res.json({
      success: true,
      data: paymentMethods
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
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