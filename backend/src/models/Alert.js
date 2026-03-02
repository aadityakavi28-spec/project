const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    assetType: {
      type: String,
      enum: ['bridge', 'building', 'tunnel'],
      required: true,
    },
    type: {
      type: String,
      enum: [
        'vibration', 'load', 'crack', 'temperature', 'risk',
        'tilt', 'displacement', 'waterPressure', 'humidity', 'structuralStrain',
        'structuralDegradation'
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high',
    },
    message: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
    riskScore: {
      type: Number,
      default: 0,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for queries
alertSchema.index({ assetId: 1, resolved: 1, createdAt: -1 });
alertSchema.index({ assetType: 1, severity: 1 });

module.exports = mongoose.model('Alert', alertSchema);
