import React from 'react';

const RiskMeter = ({ 
  riskScore = 50, 
  assetType = 'bridge',
  sensors = {} // Generic sensors object
}) => {
  // Get sensor values from the sensors object or use defaults
  const vibration = sensors.vibration ?? 0;
  const crack = sensors.crack ?? 0;
  const load = sensors.load ?? 0;
  const tilt = sensors.tilt ?? 0;
  const displacement = sensors.displacement ?? 0;
  const waterPressure = sensors.waterPressure ?? 0;
  const humidity = sensors.humidity ?? 0;
  const structuralStrain = sensors.structuralStrain ?? 0;

  // Determine risk level - Light Theme
  const getRiskLevel = () => {
    if (riskScore > 75) return { 
      level: 'CRITICAL', 
      color: 'text-rose-600', 
      bgColor: 'bg-rose-50', 
      borderColor: 'border-rose-300',
      icon: '🔴',
      gradient: 'from-rose-500 to-rose-600'
    };
    if (riskScore > 50) return { 
      level: 'WARNING', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50', 
      borderColor: 'border-orange-300',
      icon: '🟠',
      gradient: 'from-orange-500 to-amber-500'
    };
    if (riskScore > 25) return { 
      level: 'MONITORING', 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-300',
      icon: '🟡',
      gradient: 'from-amber-500 to-yellow-500'
    };
    return { 
      level: 'HEALTHY', 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50', 
      borderColor: 'border-emerald-300',
      icon: '🟢',
      gradient: 'from-emerald-500 to-teal-500'
    };
  };

  const riskLevel = getRiskLevel();
  
  // Get sensor breakdown based on asset type
  const getSensorBreakdown = () => {
    switch(assetType) {
      case 'bridge':
        return [
          { name: 'Vibration', value: vibration, max: 100, unit: 'm/s²', icon: '📈', color: 'from-primary-400 to-primary-500', percentage: Math.min((vibration / 100) * 100, 100) },
          { name: 'Crack', value: crack, max: 25, unit: 'mm', icon: '🔍', color: 'from-amber-400 to-orange-400', percentage: Math.min((crack / 25) * 100, 100) },
          { name: 'Load', value: load, max: 100, unit: 'MN', icon: '⚖️', color: 'from-orange-400 to-rose-400', percentage: Math.min((load / 100) * 100, 100) },
        ];
      case 'building':
        return [
          { name: 'Tilt', value: tilt, max: 5, unit: '°', icon: '📐', color: 'from-violet-400 to-purple-500', percentage: Math.min((tilt / 5) * 100, 100) },
          { name: 'Displacement', value: displacement, max: 50, unit: 'mm', icon: '↔️', color: 'from-purple-400 to-pink-400', percentage: Math.min((displacement / 50) * 100, 100) },
          { name: 'Crack', value: crack, max: 20, unit: 'mm', icon: '🔍', color: 'from-amber-400 to-orange-400', percentage: Math.min((crack / 20) * 100, 100) },
          { name: 'Vibration', value: vibration, max: 30, unit: 'm/s²', icon: '📈', color: 'from-primary-400 to-primary-500', percentage: Math.min((vibration / 30) * 100, 100) },
        ];
      case 'tunnel':
        return [
          { name: 'Water Pressure', value: waterPressure, max: 100, unit: 'kPa', icon: '💧', color: 'from-blue-400 to-cyan-400', percentage: Math.min((waterPressure / 100) * 100, 100) },
          { name: 'Humidity', value: humidity, max: 100, unit: '%', icon: '💨', color: 'from-sky-400 to-teal-400', percentage: Math.min((humidity / 100) * 100, 100) },
          { name: 'Crack', value: crack, max: 15, unit: 'mm', icon: '🔍', color: 'from-amber-400 to-orange-400', percentage: Math.min((crack / 15) * 100, 100) },
          { name: 'Strain', value: structuralStrain, max: 1000, unit: 'με', icon: '📊', color: 'from-rose-400 to-red-400', percentage: Math.min((structuralStrain / 1000) * 100, 100) },
        ];
      default:
        return [];
    }
  };

  const sensorBreakdown = getSensorBreakdown();
  const getFormula = () => {
    switch(assetType) {
      case 'bridge':
        return 'Risk = (V × 0.4) + (C × 0.3) + (L × 0.3)';
      case 'building':
        return 'Risk = (T × 0.35) + (D × 0.3) + (C × 0.35)';
      case 'tunnel':
        return 'Risk = (WP × 0.3) + (H × 0.2) + (C × 0.25) + (S × 0.25)';
      default:
        return 'Structural Health Index';
    }
  };

  return (
    <div className={`card-professional p-6 border-2 ${riskLevel.borderColor} ${riskLevel.bgColor}`}>
      <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-3">
        <span className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-xl">📊</span>
        <span>Risk Assessment</span>
      </h3>
      
      {/* Risk Score Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="64"
              stroke="#e2e8f0"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="72"
              cy="72"
              r="64"
              stroke="url(#riskGradient)"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${(riskScore / 100) * 402.12} 402.12`}
              className="transition-all duration-1000"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={riskScore > 50 ? "#f43f5e" : riskScore > 25 ? "#f59e0b" : "#10b981"} />
                <stop offset="100%" stopColor={riskScore > 50 ? "#f97316" : riskScore > 25 ? "#eab308" : "#0ea5e9"} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <p className={`text-4xl font-extrabold ${riskLevel.color}`}>
              {riskScore.toFixed(0)}
            </p>
            <p className="text-xs text-text-muted font-medium">/ 100</p>
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className={`text-center mb-5 py-3 px-4 rounded-xl ${riskLevel.bgColor} border-2 ${riskLevel.borderColor}`}>
        <p className={`text-lg font-bold ${riskLevel.color} flex items-center justify-center gap-2`}>
          <span className="text-xl">{riskLevel.icon}</span>
          <span>{riskLevel.level} RISK</span>
        </p>
      </div>

      {/* Sensor Breakdown */}
      <div className="space-y-4 mb-5">
        {sensorBreakdown.map((sensor, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{sensor.icon}</span>
                <span className="text-sm font-semibold text-text-secondary">{sensor.name}</span>
              </div>
              <span className="font-bold text-text-primary">{sensor.value.toFixed(1)}{sensor.unit}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${sensor.color} transition-all duration-700`}
                style={{ width: `${sensor.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Risk Formula */}
      <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
        <p className="text-xs text-text-secondary font-mono text-center">
          <span className="text-primary-600 font-bold">📐 Formula:</span> 
          <br />
          {getFormula()}
        </p>
      </div>
    </div>
  );
};

export default RiskMeter;
