const mongoose = require('mongoose');

const newsflashSchema = new mongoose.Schema({
  authorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  targetType: {
    type: String,
    enum: ['friends', 'group'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: function() {
      return this.targetType === 'group';
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for performance
newsflashSchema.index({ authorId: 1, createdAt: -1 });
newsflashSchema.index({ targetType: 1, targetId: 1 });
newsflashSchema.index({ isDeleted: 1 });
newsflashSchema.index({ createdAt: -1 });

// Virtual for author info (will be populated)
newsflashSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: 'uuid',
  justOne: true
});

// Static method to find newsflashes for friends
newsflashSchema.statics.findForFriends = function() {
  return this.find({
    targetType: 'friends',
    isDeleted: false
  }).sort({ createdAt: -1 });
};

// Static method to find newsflashes for a group
newsflashSchema.statics.findForGroup = function(groupId) {
  return this.find({
    targetType: 'group',
    targetId: groupId,
    isDeleted: false
  }).sort({ createdAt: -1 });
};

// Static method to find newsflashes by author
newsflashSchema.statics.findByAuthor = function(authorId) {
  return this.find({
    authorId,
    isDeleted: false
  }).sort({ createdAt: -1 });
};

// Method to soft delete
newsflashSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// Ensure virtuals are included when converting to JSON
newsflashSchema.set('toJSON', { virtuals: true });
newsflashSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Newsflash', newsflashSchema);
