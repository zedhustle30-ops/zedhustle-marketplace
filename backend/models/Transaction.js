const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'investment', 'payment', 'refund', 'fee'],
    required: true
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ZMW' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['airtel_money', 'mtn_money', 'bank_transfer', 'visa', 'mastercard', 'wallet'],
    required: true
  },
  paymentDetails: {
    phoneNumber: String, // For mobile money
    accountNumber: String, // For bank transfers
    bankName: String,
    reference: String, // External payment reference
    providerTransactionId: String
  },
  reference: { type: String, unique: true }, // Internal reference
  description: String,
  metadata: {
    investmentId: mongoose.Schema.Types.ObjectId,
    jobId: mongoose.Schema.Types.ObjectId,
    portfolioId: mongoose.Schema.Types.ObjectId,
    fees: {
      platform: Number,
      payment: Number,
      total: Number
    }
  },
  balanceBefore: Number,
  balanceAfter: Number,
  processedAt: Date,
  failureReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate unique reference before saving
TransactionSchema.pre('save', function(next) {
  if (!this.reference) {
    this.reference = 'ZH' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
