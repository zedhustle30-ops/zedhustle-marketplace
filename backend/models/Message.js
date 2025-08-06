const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Message Type
  type: {
    type: String,
    enum: ['chat', 'notification', 'system'],
    required: true
  },
  
  // Sender and Recipient
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'chat';
    }
  },
  
  // Message Content
  subject: {
    type: String,
    required: function() {
      return this.type === 'notification' || this.type === 'system';
    }
  },
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['text', 'image', 'file', 'link'],
    default: 'text'
  },
  
  // Media Attachments
  attachments: [{
    url: String,
    filename: String,
    size: Number,
    type: String
  }],
  
  // Message Status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Read Status
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Chat Room (for group chats)
  chatRoom: {
    type: String,
    required: function() {
      return this.type === 'chat';
    }
  },
  
  // Notification Specific Fields
  notificationType: {
    type: String,
    enum: ['job_application', 'investment_update', 'trading_alert', 'payment_confirmation', 'system_maintenance', 'promotional'],
    required: function() {
      return this.type === 'notification';
    }
  },
  notificationData: {
    jobId: mongoose.Schema.Types.ObjectId,
    investmentId: mongoose.Schema.Types.ObjectId,
    transactionId: mongoose.Schema.Types.ObjectId,
    actionUrl: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
  },
  
  // Reply Information
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Timestamps
  sentAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: Date,
  readAt: Date
}, {
  timestamps: true
});

// Virtual for is read
messageSchema.virtual('isRead').get(function() {
  return this.readBy.length > 0;
});

// Virtual for read by specific user
messageSchema.methods.isReadBy = function(userId) {
  return this.readBy.some(read => read.user.toString() === userId.toString());
};

// Method to mark as read
messageSchema.methods.markAsRead = function(userId) {
  if (!this.isReadBy(userId)) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
    this.status = 'read';
    this.readAt = new Date();
  }
  return this.save();
};

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  if (this.status === 'sent') {
    this.status = 'delivered';
    this.deliveredAt = new Date();
  }
  return this.save();
};

// Static method to get chat messages between two users
messageSchema.statics.getChatMessages = function(user1Id, user2Id, limit = 50) {
  return this.find({
    type: 'chat',
    $or: [
      { sender: user1Id, recipient: user2Id },
      { sender: user2Id, recipient: user1Id }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('sender', 'profile.firstName profile.lastName profileImage')
  .populate('recipient', 'profile.firstName profile.lastName profileImage');
};

// Static method to get user notifications
messageSchema.statics.getUserNotifications = function(userId, limit = 20) {
  return this.find({
    recipient: userId,
    type: { $in: ['notification', 'system'] }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('sender', 'profile.firstName profile.lastName');
};

// Static method to get unread count
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    type: 'chat',
    'readBy.user': { $ne: userId }
  });
};

// Static method to get notification count
messageSchema.statics.getNotificationCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    type: { $in: ['notification', 'system'] },
    'readBy.user': { $ne: userId }
  });
};

// Static method to send system notification
messageSchema.statics.sendSystemNotification = function(recipients, subject, content, data = {}) {
  const messages = recipients.map(recipientId => ({
    type: 'system',
    sender: null, // System sender
    recipient: recipientId,
    subject,
    content,
    notificationData: data
  }));
  
  return this.insertMany(messages);
};

// Static method to send job application notification
messageSchema.statics.sendJobApplicationNotification = function(employerId, jobId, applicantId) {
  return this.create({
    type: 'notification',
    sender: applicantId,
    recipient: employerId,
    subject: 'New Job Application',
    content: 'You have received a new job application.',
    notificationType: 'job_application',
    notificationData: {
      jobId,
      actionUrl: `/jobs/${jobId}/applications`
    }
  });
};

// Static method to send investment update
messageSchema.statics.sendInvestmentUpdate = function(investorId, businessId, updateType, content) {
  return this.create({
    type: 'notification',
    sender: null,
    recipient: investorId,
    subject: `Investment Update - ${updateType}`,
    content,
    notificationType: 'investment_update',
    notificationData: {
      investmentId: businessId,
      actionUrl: `/investments/${businessId}`
    }
  });
};

// Static method to send trading alert
messageSchema.statics.sendTradingAlert = function(userId, tokenSymbol, alertType, content) {
  return this.create({
    type: 'notification',
    sender: null,
    recipient: userId,
    subject: `Trading Alert - ${tokenSymbol}`,
    content,
    notificationType: 'trading_alert',
    notificationData: {
      actionUrl: `/trading`
    }
  });
};

// Static method to send payment confirmation
messageSchema.statics.sendPaymentConfirmation = function(userId, transactionId, amount, type) {
  return this.create({
    type: 'notification',
    sender: null,
    recipient: userId,
    subject: 'Payment Confirmation',
    content: `Your ${type} of K${amount} has been confirmed.`,
    notificationType: 'payment_confirmation',
    notificationData: {
      transactionId,
      actionUrl: `/payments/transactions`
    }
  });
};

// Indexes for performance
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, type: 1, createdAt: -1 });
messageSchema.index({ 'readBy.user': 1 });

module.exports = mongoose.model('Message', messageSchema); 