const mongoose = require('mongoose');

const groupInvitationSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Group'
  },
  invitedUserId: {
    type: String,
    required: true,
    ref: 'User'
  },
  inviterId: {
    type: String,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
groupInvitationSchema.index({ groupId: 1, invitedUserId: 1 }, { unique: true });
groupInvitationSchema.index({ invitedUserId: 1, status: 1 });
groupInvitationSchema.index({ groupId: 1, status: 1 });

// Static method to find pending invitations for a user
groupInvitationSchema.statics.findPendingForUser = function(userId) {
  return this.find({
    invitedUserId: userId,
    status: 'pending'
  }).populate('groupId', 'name description');
};

// Static method to find pending invitations for a group
groupInvitationSchema.statics.findPendingForGroup = function(groupId) {
  return this.find({
    groupId,
    status: 'pending'
  });
};

// Method to accept invitation
groupInvitationSchema.methods.accept = function() {
  this.status = 'accepted';
  return this.save();
};

// Method to decline invitation
groupInvitationSchema.methods.decline = function() {
  this.status = 'declined';
  return this.save();
};

module.exports = mongoose.model('GroupInvitation', groupInvitationSchema);
