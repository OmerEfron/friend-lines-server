const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  creatorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  members: [{
    type: String,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for performance
groupSchema.index({ creatorId: 1 });
groupSchema.index({ members: 1 });
groupSchema.index({ name: 1 });

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Method to add member
groupSchema.methods.addMember = function(userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove member
groupSchema.methods.removeMember = function(userId) {
  if (this.creatorId === userId) {
    throw new Error('Group creator cannot be removed');
  }
  
  const index = this.members.indexOf(userId);
  if (index > -1) {
    this.members.splice(index, 1);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to check if user is member
groupSchema.methods.isMember = function(userId) {
  return this.members.includes(userId);
};

// Static method to find groups by user
groupSchema.statics.findByUser = function(userId) {
  return this.find({ members: userId });
};

module.exports = mongoose.model('Group', groupSchema);
