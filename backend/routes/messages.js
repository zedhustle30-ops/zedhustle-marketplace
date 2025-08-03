const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Get user's notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const notifications = await Message.find({
      recipient: req.user._id,
      type: { $in: ['notification', 'system'] }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('sender', 'profile.firstName profile.lastName profileImage');
    
    const total = await Message.countDocuments({
      recipient: req.user._id,
      type: { $in: ['notification', 'system'] }
    });
    
    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get unread notification count
router.get('/notifications/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await Message.getNotificationCount(req.user._id);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: 'MESSAGE_001', message: 'Message not found' }
      });
    }
    
    // Check if user is the recipient
    if (message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Unauthorized' }
      });
    }
    
    await message.markAsRead(req.user._id);
    
    res.json({
      success: true,
      data: message,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Mark all notifications as read
router.put('/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    const unreadMessages = await Message.find({
      recipient: req.user._id,
      type: { $in: ['notification', 'system'] },
      'readBy.user': { $ne: req.user._id }
    });
    
    for (const message of unreadMessages) {
      await message.markAsRead(req.user._id);
    }
    
    res.json({
      success: true,
      data: { count: unreadMessages.length },
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all messages as read:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get chat messages with another user
router.get('/chat/:userId', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    
    // Check if other user exists
    const otherUser = await User.findById(req.params.userId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_001', message: 'User not found' }
      });
    }
    
    const messages = await Message.find({
      type: 'chat',
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('sender', 'profile.firstName profile.lastName profileImage')
    .populate('recipient', 'profile.firstName profile.lastName profileImage');
    
    const total = await Message.countDocuments({
      type: 'chat',
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    });
    
    res.json({
      success: true,
      data: messages.reverse(), // Show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Send a chat message
router.post('/chat/:userId', authenticateToken, async (req, res) => {
  try {
    const { content, contentType = 'text' } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: { code: 'MESSAGE_002', message: 'Message content is required' }
      });
    }
    
    // Check if other user exists
    const otherUser = await User.findById(req.params.userId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_001', message: 'User not found' }
      });
    }
    
    const message = new Message({
      type: 'chat',
      sender: req.user._id,
      recipient: req.params.userId,
      content,
      contentType,
      chatRoom: `chat_${req.user._id}_${req.params.userId}`
    });
    
    await message.save();
    
    // Populate sender info
    await message.populate('sender', 'profile.firstName profile.lastName profileImage');
    
    res.json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get user's chat conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    // Get all unique conversations for the user
    const conversations = await Message.aggregate([
      {
        $match: {
          type: 'chat',
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', req.user._id] },
                    { $not: { $in: [req.user._id, '$readBy.user'] } }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);
    
    // Populate user information for each conversation
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = await User.findById(conv._id).select('profile.firstName profile.lastName profileImage');
        return {
          ...conv,
          otherUser
        };
      })
    );
    
    res.json({
      success: true,
      data: populatedConversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get unread chat count
router.get('/chat/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user._id);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error fetching unread chat count:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Mark chat messages as read
router.put('/chat/:userId/read', authenticateToken, async (req, res) => {
  try {
    const unreadMessages = await Message.find({
      type: 'chat',
      sender: req.params.userId,
      recipient: req.user._id,
      'readBy.user': { $ne: req.user._id }
    });
    
    for (const message of unreadMessages) {
      await message.markAsRead(req.user._id);
    }
    
    res.json({
      success: true,
      data: { count: unreadMessages.length },
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking chat messages as read:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Delete a message (sender only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: 'MESSAGE_001', message: 'Message not found' }
      });
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Only the sender can delete a message' }
      });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Search users for chat
router.get('/search-users', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const users = await User.find({
      $or: [
        { 'profile.firstName': { $regex: query, $options: 'i' } },
        { 'profile.lastName': { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: req.user._id } // Exclude current user
    })
    .select('profile.firstName profile.lastName profileImage email')
    .limit(10);
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

module.exports = router; 