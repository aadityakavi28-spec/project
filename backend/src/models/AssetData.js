const mongoose = require('mongoose');

const assetDataSchema = new mongoose.Schema({
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true,
  },
  // Bridge sensors
  vibration: {
    type: Number,
    default: 0,
    min: 0,
  },
  load: {
    type: Number,
    default: 0,
    min: 0,
  },
  crack: {
    type: Number,
    default: 0,
    min: 0,
  },
  temperature: {
    type: Number,
    default: 20,
  },
  // Building sensors
  tilt: {
    type: Number,
    default: 0,
    min: 0,
  },
  displacement: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Tunnel sensors
  waterPressure: {
    type: Number,
    default: 0,
    min: 0,
  },
  humidity: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },
  structuralStrain: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Calculated fields
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  healthIndex: {
    type: Number,
    default: 1,
    min: 0,
    max: 1,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: false });

// Indexes
assetDataSchema.index({ assetId: 1, timestamp: -1 });
assetDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

module.exports = mongoose.model('AssetData', assetDataSchema);
