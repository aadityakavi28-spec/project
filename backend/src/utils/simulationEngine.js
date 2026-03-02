// ============================================================
// DETERMINISTIC SIMULATION ENGINE
// Multi-Asset Structural Monitoring Platform
// ============================================================

const SENSOR_CONFIG = {
  bridge: {
    vibration: { baseline: 15, min: 5, max: 95, threshold: 70, weight: 0.4 },
    load: { baseline: 35, min: 10, max: 100, threshold: 80, weight: 0.3 },
    crack: { baseline: 5, min: 0, max: 25, threshold: 15, weight: 0.3 },
    temperature: { baseline: 22, min: 10, max: 40, threshold: 35, weight: 0 },
  },
  building: {
    tilt: { baseline: 0.5, min: 0, max: 5, threshold: 3, weight: 0.3 },
    displacement: { baseline: 5, min: 0, max: 50, threshold: 35, weight: 0.3 },
    crack: { baseline: 2, min: 0, max: 20, threshold: 12, weight: 0.2 },
    vibration: { baseline: 3, min: 0, max: 30, threshold: 20, weight: 0.2 },
  },
  tunnel: {
    waterPressure: { baseline: 20, min: 0, max: 100, threshold: 70, weight: 0.3 },
    humidity: { baseline: 55, min: 30, max: 100, threshold: 85, weight: 0.2 },
    crack: { baseline: 1, min: 0, max: 15, threshold: 10, weight: 0.25 },
    structuralStrain: { baseline: 150, min: 0, max: 1000, threshold: 700, weight: 0.25 },
  },
};

// State management for simulation
const simulationState = new Map();

// Initialize simulation for an asset
const initializeAsset = (assetId, assetType) => {
  const config = SENSOR_CONFIG[assetType];
  if (!config) return null;

  const state = {
    assetType,
    time: 0,
    degradation: 0,
    trend: {},
    lastValues: {},
    environmentalFactor: Math.random() * 0.2 - 0.1, // -0.1 to 0.1
  };

  Object.keys(config).forEach(sensorId => {
    const sensor = config[sensorId];
    state.lastValues[sensorId] = sensor.baseline;
    state.trend[sensorId] = 0;
  });

  simulationState.set(assetId, state);
  return state;
};

// Deterministic bounded fluctuation (±3% max)
const boundedFluctuation = (currentValue, maxValue, time) => {
  const maxChange = maxValue * 0.03;
  const fluctuation = Math.sin(time * 1.5) * maxChange * 0.5 +
                     Math.sin(time * 2.3) * maxChange * 0.3 +
                     Math.sin(time * 0.7) * maxChange * 0.2;
  return currentValue + fluctuation;
};

// Calculate risk score
const calculateRisk = (assetType, sensorValues) => {
  const config = SENSOR_CONFIG[assetType];
  if (!config) return 0;

  let risk = 0;
  let totalWeight = 0;

  if (assetType === 'bridge') {
    const { vibration, load, crack } = sensorValues;
    risk = (vibration * 0.4) + (crack * 0.3) + (load * 0.3);
  } else if (assetType === 'building') {
    const { tilt, displacement, crack, vibration } = sensorValues;
    risk = (tilt * 20) + (displacement * 1.5) + (crack * 3) + (vibration * 2);
  } else if (assetType === 'tunnel') {
    const { waterPressure, humidity, crack, structuralStrain } = sensorValues;
    risk = (waterPressure * 0.8) + (humidity * 0.5) + (crack * 5) + (structuralStrain * 0.07);
  }

  return Math.min(100, Math.max(0, risk));
};

// Generate sensor values
const generateSensorData = (assetId, assetType) => {
  let state = simulationState.get(assetId);
  
  if (!state) {
    state = initializeAsset(assetId, assetType);
  }

  const config = SENSOR_CONFIG[assetType];
  const newValues = {};
  
  state.time += 1;
  state.degradation += 0.05; // Very slow degradation

  Object.keys(config).forEach(sensorId => {
    const sensor = config[sensorId];
    const currentValue = state.lastValues[sensorId];

    // Update trend based on threshold proximity
    const thresholdRatio = currentValue / sensor.threshold;
    if (thresholdRatio > 0.7) {
      state.trend[sensorId] = Math.min(1, state.trend[sensorId] + 0.02);
    } else {
      state.trend[sensorId] = Math.max(-0.5, state.trend[sensorId] - 0.005);
    }

    // Calculate target change
    let targetChange = 0;
    targetChange += state.trend[sensorId] * (sensor.max - sensor.min) * 0.002;
    targetChange += state.degradation * (sensor.max - sensor.min) * 0.0001;
    targetChange += state.environmentalFactor * sensor.max * 0.01;

    // Apply bounded fluctuation
    let newValue = currentValue + targetChange;
    newValue = boundedFluctuation(newValue, sensor.max, state.time);

    // Clamp to valid range
    newValue = Math.max(sensor.min, Math.min(sensor.max, newValue));

    newValues[sensorId] = parseFloat(newValue.toFixed(2));
    state.lastValues[sensorId] = newValue;
  });

  // Calculate risk and health index
  const riskScore = calculateRisk(assetType, newValues);
  const healthIndex = parseFloat((1 - riskScore / 100).toFixed(2));

  return {
    sensors: newValues,
    riskScore: parseFloat(riskScore.toFixed(1)),
    healthIndex,
  };
};

// Reset simulation (for maintenance)
const resetSimulation = (assetId) => {
  const state = simulationState.get(assetId);
  if (state) {
    state.degradation = 0;
    state.trend = {};
    Object.keys(SENSOR_CONFIG[state.assetType] || {}).forEach(sensorId => {
      state.trend[sensorId] = 0;
      state.lastValues[sensorId] = SENSOR_CONFIG[state.assetType][sensorId].baseline;
    });
  }
};

// Get sensor config
const getSensorConfig = (assetType) => {
  return SENSOR_CONFIG[assetType] || SENSOR_CONFIG.bridge;
};

module.exports = {
  generateSensorData,
  calculateRisk,
  resetSimulation,
  getSensorConfig,
  SENSOR_CONFIG,
};
