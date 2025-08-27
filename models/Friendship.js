const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  user1Id: {
    type: String,
    required: true,
    ref: 'User'
  },
  user2Id: {
    type: String,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique friendships and efficient queries
friendshipSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });
friendshipSchema.index({ user2Id: 1, user1Id: 1 }, { unique: true });
friendshipSchema.index({ status: 1 });

// Virtual for the other user in the friendship
friendshipSchema.virtual('otherUserId').get(function() {
  return this.user1Id === this.user1Id ? this.user2Id : this.user1Id;
});

// Static method to find friends for a user
friendshipSchema.statics.findFriends = function(userId) {
  return this.find({
    $or: [{ user1Id: userId }, { user2Id: userId }],
    status: 'accepted'
  });
};

// Static method to find pending requests for a user
friendshipSchema.statics.findPendingRequests = function(userId) {
  return this.find({
    user2Id: userId,
    status: 'pending'
  });
};

// Static method to check if two users are friends
friendshipSchema.statics.areFriends = function(user1Id, user2Id) {
  return this.findOne({
    $or: [
      { user1Id, user2Id, status: 'accepted' },
      { user1Id: user2Id, user2Id: user1Id, status: 'accepted' }
    ]
  });
};

module.exports = mongoose.model('Friendship', friendshipSchema);
