const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an asset name'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['bridge', 'building', 'tunnel'],
    required: [true, 'Please specify asset type'],
  },
  location: {
    type: String,
    required: [true, 'Please provide asset location'],
    trim: true,
  },
  ownerType: {
    type: String,
    enum: ['government', 'private', 'public'],
    default: 'government',
  },
  structuralType: {
    type: String,
    default: 'standard',
  },
  yearBuilt: {
    type: Number,
    default: 2020,
  },
  status: {
    type: String,
    enum: ['operational', 'maintenance', 'alert', 'critical'],
    default: 'operational',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for faster queries
assetSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Asset', assetSchema);
