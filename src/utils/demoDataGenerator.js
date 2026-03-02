// ============================================================
// DEMO DATA GENERATOR
// Multi-Asset Structural Monitoring Platform
// ============================================================

// Demo sensor value ranges for each asset type
export const DEMO_RANGES = {
  bridge: {
    vibration: { min: 0.5, max: 1.2 },
    load: { min: 40, max: 75 },
    crack: { min: 0.5, max: 2.0 },
    temperature: { min: 25, max: 35 },
  },
  building: {
    tilt: { min: 0.2, max: 1.0 },
    displacement: { min: 2, max: 10 },
    crack: { min: 0.2, max: 1.5 },
    vibration: { min: 0.1, max: 0.8 },
  },
  tunnel: {
    waterPressure: { min: 100, max: 300 },
    humidity: { min: 60, max: 85 },
    crack: { min: 0.3, max: 2.5 },
    structuralStrain: { min: 100, max: 180 },
  },
};

// Generate stable demo value with slight fluctuation
const generateDemoValue = (range, currentValue, time) => {
  if (currentValue === undefined || currentValue === null) {
    // Initial value - use middle of range
    return (range.min + range.max) / 2;
  }
  
  // Slight fluctuation (±3% of range)
  const fluctuation = (range.max - range.min) * 0.03;
  const sineWave = Math.sin(time / 2) * fluctuation;
  const cosineWave = Math.cos(time / 3) * fluctuation * 0.5;
  
  let newValue = currentValue + sineWave + cosineWave;
  
  // Keep within bounds
  newValue = Math.max(range.min, Math.min(range.max, newValue));
  
  return newValue;
};

// Calculate risk score based on asset type and sensor values
export const calculateDemoRisk = (assetType, sensors) => {
  if (assetType === 'bridge') {
    // Higher crack = higher risk
    const crackRisk = (sensors.crack / 2.0) * 40;
    const loadRisk = (sensors.load / 75) * 30;
    const vibrationRisk = (sensors.vibration / 1.2) * 30;
    return Math.min(100, Math.max(20, crackRisk + loadRisk + vibrationRisk));
  }
  
  if (assetType === 'building') {
    const tiltRisk = (sensors.tilt / 1.0) * 35;
    const displacementRisk = (sensors.displacement / 10) * 30;
    const crackRisk = (sensors.crack / 1.5) * 35;
    return Math.min(100, Math.max(20, tiltRisk + displacementRisk + crackRisk));
  }
  
  if (assetType === 'tunnel') {
    const waterRisk = (sensors.waterPressure / 300) * 30;
    const humidityRisk = (sensors.humidity / 85) * 20;
    const crackRisk = (sensors.crack / 2.5) * 25;
    const strainRisk = (sensors.structuralStrain / 180) * 25;
    return Math.min(100, Math.max(20, waterRisk + humidityRisk + crackRisk + strainRisk));
  }
  
  return 30; // Default
};

// Generate all demo sensor values for an asset type
export const generateDemoSensors = (assetType, currentSensors = {}, time = Date.now() / 1000) => {
  const ranges = DEMO_RANGES[assetType];
  if (!ranges) return {};
  
  const sensors = {};
  
  Object.keys(ranges).forEach(key => {
    sensors[key] = generateDemoValue(ranges[key], currentSensors[key], time);
  });
  
  return sensors;
};

// Demo alerts based on risk score
export const generateDemoAlerts = (riskScore) => {
  const alerts = [];
  
  if (riskScore > 90) {
    alerts.push({
      id: 'critical-1',
      severity: 'critical',
      message: 'CRITICAL: Structural integrity compromised. Immediate inspection required.',
      timestamp: new Date().toISOString(),
    });
  }
  
  if (riskScore > 75) {
    alerts.push({
      id: 'high-1',
      severity: 'high',
      message: 'HIGH RISK: Multiple sensor thresholds exceeded. Schedule urgent inspection.',
      timestamp: new Date().toISOString(),
    });
  }
  
  return alerts;
};

export default {
  DEMO_RANGES,
  generateDemoValue,
  calculateDemoRisk,
  generateDemoSensors,
  generateDemoAlerts,
};
