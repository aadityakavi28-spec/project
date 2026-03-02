const express = require('express');
const Asset = require('../models/Asset');
const AssetData = require('../models/AssetData');
const Alert = require('../models/Alert');
const { generateSensorData, resetSimulation, getSensorConfig } = require('../utils/simulationEngine');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/assets - Get all assets (protected)
router.get('/', protect, async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    
    const assets = await Asset.find(query).sort({ createdAt: -1 });
    
    // Get latest data for each asset
    const assetsWithData = await Promise.all(
      assets.map(async (asset) => {
        const latestData = await AssetData.findOne({ assetId: asset._id }).sort({ timestamp: -1 });
        return {
          ...asset.toObject(),
          latestData,
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: assets.length,
      data: assetsWithData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/assets/types - Get assets grouped by type
router.get('/types', protect, async (req, res) => {
  try {
    const assetTypes = ['bridge', 'building', 'tunnel'];
    const result = {};
    
    for (const type of assetTypes) {
      const assets = await Asset.find({ type, status: { $ne: 'critical' } });
      const total = assets.length;
      const critical = assets.filter(a => a.status === 'critical').length;
      const alerts = await Alert.countDocuments({ assetType: type, resolved: false });
      
      // Calculate average health
      let avgHealth = 1;
      if (assets.length > 0) {
        const assetIds = assets.map(a => a._id);
        const latestData = await AssetData.aggregate([
          { $match: { assetId: { $in: assetIds } } },
          { $sort: { timestamp: -1 } },
          { $group: { _id: '$assetId', health: { $first: '$healthIndex' } } }
        ]);
        if (latestData.length > 0) {
          avgHealth = latestData.reduce((sum, d) => sum + (d.health || 0), 0) / latestData.length;
        }
      }
      
      result[type] = {
        total,
        critical,
        alerts,
        avgHealth: parseFloat(avgHealth.toFixed(2)),
      };
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/assets/:id - Get asset by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/assets - Create new asset (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, type, location, ownerType, structuralType, yearBuilt } = req.body;
    
    if (!name || !type || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, type, and location',
      });
    }
    
    const asset = await Asset.create({
      name,
      type,
      location,
      ownerType: ownerType || 'government',
      structuralType: structuralType || 'standard',
      yearBuilt: yearBuilt || 2020,
      createdBy: req.user.id,
    });
    
    res.status(201).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/assets/:id/latest - Get latest sensor data
router.get('/:id/latest', protect, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }
    
    // Generate simulated data
    const data = generateSensorData(asset._id.toString(), asset.type);
    
    // Get historical trend (last 5 readings from simulation)
    const historicalData = [];
    for (let i = 5; i > 0; i--) {
      const historical = generateSensorData(asset._id.toString() + '_hist_' + i, asset.type);
      historicalData.push(historical);
    }
    
    res.status(200).json({
      success: true,
      data: {
        asset,
        sensors: data.sensors,
        riskScore: data.riskScore,
        healthIndex: data.healthIndex,
        timestamp: new Date(),
        config: getSensorConfig(asset.type),
      },
      historicalData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/assets/:id/history - Get historical data
router.get('/:id/history', protect, async (req, res) => {
  try {
    const { hours = 24, limit = 100 } = req.query;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const data = await AssetData.find({
      assetId: req.params.id,
      timestamp: { $gte: startTime },
    })
      .sort({ timestamp: 1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/assets/:id/alerts - Get alerts for asset
router.get('/:id/alerts', protect, async (req, res) => {
  try {
    const { resolved } = req.query;
    let query = { assetId: req.params.id };
    
    if (resolved !== undefined) {
      query.resolved = resolved === 'true';
    }
    
    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/assets/:id/maintenance - Reset simulation (maintenance)
router.post('/:id/maintenance', protect, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }
    
    // Reset simulation state
    resetSimulation(asset._id.toString());
    
    // Update asset status
    asset.status = 'operational';
    await asset.save();
    
    // Resolve all alerts
    await Alert.updateMany(
      { assetId: asset._id, resolved: false },
      { resolved: true, resolvedAt: new Date() }
    );
    
    res.status(200).json({
      success: true,
      message: 'Maintenance completed, simulation reset',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/iot/upload - IoT device data upload
router.post('/iot/upload', async (req, res) => {
  try {
    const { apiKey, deviceId, assetId, sensorData } = req.body;
    
    // Simple API key validation (in production, use proper auth)
    if (!apiKey || !assetId || !sensorData) {
      return res.status(400).json({
        success: false,
        message: 'Please provide apiKey, assetId, and sensorData',
      });
    }
    
    const asset = await Asset.findById(assetId);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }
    
    // Validate sensor ranges
    const config = getSensorConfig(asset.type);
    const validatedData = {};
    const errors = [];
    
    Object.keys(sensorData).forEach(key => {
      const sensor = config[key];
      if (!sensor) {
        errors.push(`Unknown sensor: ${key}`);
        return;
      }
      
      const value = sensorData[key];
      if (value < sensor.min || value > sensor.max) {
        errors.push(`${key} value ${value} out of range (${sensor.min}-${sensor.max})`);
        validatedData[key] = Math.max(sensor.min, Math.min(sensor.max, value));
      } else {
        validatedData[key] = value;
      }
    });
    
    if (errors.length > 0 && Object.keys(validatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sensor data',
        errors,
      });
    }
    
    // Calculate risk score
    const riskScore = calculateRiskFromSensors(asset.type, validatedData);
    const healthIndex = 1 - riskScore / 100;
    
    // Save data
    const data = await AssetData.create({
      assetId,
      ...validatedData,
      riskScore,
      healthIndex,
    });
    
    // Generate alerts if needed
    await generateAlerts(asset, validatedData, riskScore);
    
    res.status(201).json({
      success: true,
      message: 'Sensor data uploaded',
      data: {
        ...data.toObject(),
        warnings: errors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Helper function to calculate risk
function calculateRiskFromSensors(assetType, sensors) {
  if (assetType === 'bridge') {
    return (sensors.vibration * 0.4) + (sensors.crack * 0.3) + (sensors.load * 0.3);
  } else if (assetType === 'building') {
    return (sensors.tilt * 20) + (sensors.displacement * 1.5) + (sensors.crack * 3) + (sensors.vibration * 2);
  } else if (assetType === 'tunnel') {
    return (sensors.waterPressure * 0.8) + (sensors.humidity * 0.5) + (sensors.crack * 5) + (sensors.structuralStrain * 0.07);
  }
  return 0;
}

// Helper to generate alerts
async function generateAlerts(asset, sensors, riskScore) {
  const config = getSensorConfig(asset.type);
  const alerts = [];
  
  // Check risk score
  if (riskScore > 90) {
    alerts.push({
      assetId: asset._id,
      assetType: asset.type,
      type: 'risk',
      severity: 'critical',
      message: `Critical risk score: ${riskScore.toFixed(1)}`,
      value: riskScore,
      threshold: 90,
      riskScore,
    });
  } else if (riskScore > 75) {
    alerts.push({
      assetId: asset._id,
      assetType: asset.type,
      type: 'risk',
      severity: 'high',
      message: `High risk score: ${riskScore.toFixed(1)}`,
      value: riskScore,
      threshold: 75,
      riskScore,
    });
  }
  
  // Check individual sensors
  Object.keys(sensors).forEach(key => {
    const sensor = config[key];
    if (!sensor) return;
    
    const value = sensors[key];
    if (value > sensor.threshold) {
      alerts.push({
        assetId: asset._id,
        assetType: asset.type,
        type: key,
        severity: value > sensor.threshold * 1.2 ? 'critical' : 'high',
        message: `${sensor.name} exceeded threshold: ${value.toFixed(1)}${sensor.unit}`,
        value,
        threshold: sensor.threshold,
        riskScore,
      });
    }
  });
  
  // Create alerts (avoid duplicates)
  for (const alert of alerts) {
    const existing = await Alert.findOne({
      assetId: alert.assetId,
      type: alert.type,
      severity: { $in: ['high', 'critical'] },
      resolved: false,
    });
    
    if (!existing) {
      await Alert.create(alert);
      
      // Update asset status
      if (riskScore > 90) {
        asset.status = 'critical';
      } else if (riskScore > 75) {
        asset.status = 'alert';
      }
      await asset.save();
    }
  }
}

module.exports = router;
