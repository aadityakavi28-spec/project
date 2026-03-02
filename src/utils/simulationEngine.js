// ============================================================
// DETERMINISTIC SIMULATION ENGINE
// Multi-Asset Structural Monitoring Platform
// ============================================================

import { ASSET_TYPE_CONFIG, calculateRiskScore, getRiskLevel } from './assetTypes';

// ============================================================
// SIMULATION STATE MANAGEMENT
// ============================================================

// Global simulation state per asset
const simulationState = new Map();

// Initialize simulation state for an asset
export const initializeSimulation = (assetType, assetId) => {
  const config = ASSET_TYPE_CONFIG[assetType];
  if (!config) return null;

  const state = {
    assetType,
    assetId,
    time: 0,
    degradation: 0,
    trend: {}, // Track trend direction for each sensor
    lastValues: {},
    baselineValues: {},
    anomalyMode: false,
    anomalyTimer: 0,
  };

  // Initialize baseline values from config
  Object.keys(config.sensors).forEach(sensorId => {
    const sensor = config.sensors[sensorId];
    state.baselineValues[sensorId] = sensor.baseline;
    state.lastValues[sensorId] = sensor.baseline;
    state.trend[sensorId] = 0; // 0 = stable, 1 = increasing, -1 = decreasing
  });

  simulationState.set(assetId, state);
  return state;
};

// Get simulation state
export const getSimulationState = (assetId) => {
  return simulationState.get(assetId);
};

// ============================================================
// DETERMINISTIC VALUE GENERATION
// ============================================================

// Bounded random with controlled fluctuation (±3% max)
const boundedFluctuation = (currentValue, maxValue, maxPercent = 0.03) => {
  const maxChange = maxValue * maxPercent;
  // Use sine waves for deterministic "random" behavior
  const time = Date.now() / 10000;
  const fluctuation = Math.sin(time) * maxChange * 0.5 + 
                       Math.sin(time * 2.3) * maxChange * 0.3 +
                       Math.sin(time * 0.7) * maxChange * 0.2;
  return currentValue + fluctuation;
};

// Trend-based value evolution
const evolveWithTrend = (currentValue, baseline, trend, degradation, config) => {
  const { min, max } = config;
  const range = max - min;
  
  // Calculate target value based on trend and degradation
  let targetChange = 0;
  
  // Trend influence (slow movement toward higher values)
  if (trend > 0) {
    targetChange = range * 0.001; // Very slow increase
  } else if (trend < 0) {
    targetChange = -range * 0.001;
  }
  
  // Degradation influence (accelerates over time)
  targetChange += degradation * range * 0.0001;
  
  // Apply bounded change
  let newValue = currentValue + targetChange;
  
  // Clamp to valid range
  newValue = Math.max(min, Math.min(max, newValue));
  
  return newValue;
};

// Update trend direction randomly but deterministically
const updateTrend = (currentTrend, sensorValue, threshold, baseline) => {
  const thresholdRatio = sensorValue / threshold;
  
  // If approaching threshold, trend tends to go up
  if (thresholdRatio > 0.7) {
    return Math.min(1, currentTrend + 0.01);
  }
  
  // If below baseline, trend tends to go up slightly
  if (sensorValue < baseline) {
    return Math.min(0.5, currentTrend + 0.005);
  }
  
  // Otherwise, slight random fluctuation (deterministic)
  const time = Date.now() / 50000;
  return Math.sin(time) * 0.3;
};

// ============================================================
// UPDATE SENSOR VALUES (Deterministic)
// ============================================================

export const updateSensorValues = (assetType, assetId, deltaTime = 1) => {
  const state = simulationState.get(assetId);
  const config = ASSET_TYPE_CONFIG[assetType];
  
  if (!state || !config) return null;

  const newValues = {};
  
  // Update time
  state.time += deltaTime;
  
  // Slowly increase degradation over time
  state.degradation += deltaTime * 0.1;
  
  // Update each sensor
  Object.keys(config.sensors).forEach(sensorId => {
    const sensorConfig = config.sensors[sensorId];
    const currentValue = state.lastValues[sensorId];
    
    // Update trend
    state.trend[sensorId] = updateTrend(
      state.trend[sensorId],
      currentValue,
      sensorConfig.threshold,
      sensorConfig.baseline
    );
    
    // Evolve value with trend and degradation
    let newValue = evolveWithTrend(
      currentValue,
      sensorConfig.baseline,
      state.trend[sensorId],
      state.degradation,
      sensorConfig
    );
    
    // Add bounded fluctuation
    newValue = boundedFluctuation(newValue, sensorConfig.max);
    
    // Add occasional environmental influence (deterministic based on time)
    const envFactor = Math.sin(state.time / 10) * sensorConfig.max * 0.02;
    newValue += envFactor;
    
    // Clamp to valid range
    newValue = Math.max(sensorConfig.min, Math.min(sensorConfig.max, newValue));
    
    newValues[sensorId] = newValue;
    state.lastValues[sensorId] = newValue;
  });

  // Calculate risk score
  const riskScore = calculateRiskScore(assetType, newValues);
  const riskLevel = getRiskLevel(riskScore);

  return {
    sensors: newValues,
    riskScore,
    riskLevel: riskLevel.label,
    time: state.time,
    degradation: state.degradation,
  };
};

// ============================================================
// TRIGGER ANOMALY (for testing/demonstration)
// ============================================================

export const triggerAnomaly = (assetId, sensorId, intensity = 1) => {
  const state = simulationState.get(assetId);
  if (!state) return;

  state.anomalyMode = true;
  state.anomalyTimer = 10; // 10 ticks
  
  // Force sensor to spike
  if (state.lastValues[sensorId] !== undefined) {
    state.lastValues[sensorId] *= (1 + intensity * 0.5);
    state.trend[sensorId] = 1; // Strong upward trend
  }
};

// ============================================================
// GET CURRENT SENSOR VALUES
// ============================================================

export const getCurrentValues = (assetId) => {
  const state = simulationState.get(assetId);
  if (!state) return null;
  return { ...state.lastValues };
};

// ============================================================
// HISTORY TRACKING
// ============================================================

const historyData = new Map();

export const addToHistory = (assetId, data) => {
  if (!historyData.has(assetId)) {
    historyData.set(assetId, []);
  }
  
  const history = historyData.get(assetId);
  history.push({
    ...data,
    timestamp: Date.now(),
  });
  
  // Keep last 100 points
  if (history.length > 100) {
    history.shift();
  }
};

export const getHistory = (assetId) => {
  return historyData.get(assetId) || [];
};

// ============================================================
// CHART DATA GENERATION
// ============================================================

export const generateChartData = (assetId, sensorId, maxPoints = 30) => {
  const history = historyData.get(assetId) || [];
  return history.slice(-maxPoints).map((point, index) => ({
    time: index,
    [sensorId]: point.sensors[sensorId],
  }));
};

// ============================================================
// SENSOR STATUS DETERMINATION
// ============================================================

export const getSensorStatus = (assetType, sensorId, value) => {
  const config = ASSET_TYPE_CONFIG[assetType];
  if (!config) return 'normal';
  
  const sensor = config.sensors[sensorId];
  if (!sensor) return 'normal';
  
  const ratio = value / sensor.threshold;
  
  if (ratio > 1) return 'critical';
  if (ratio > 0.7) return 'warning';
  return 'normal';
};

export default {
  initializeSimulation,
  getSimulationState,
  updateSensorValues,
  triggerAnomaly,
  getCurrentValues,
  addToHistory,
  getHistory,
  generateChartData,
  getSensorStatus,
};
