
import React from 'react';

const RiskMeter = ({ riskScore = 50, assetType = 'bridge', sensors = {} }) => {
  const vibration = sensors.vibration ?? 0;
  const crack = sensors.crack ?? 0;
  const load = sensors.load ?? 0;
  const tilt = sensors.tilt ?? 0;
  const displacement = sensors.displacement ?? 0;
  const waterPressure = sensors.waterPressure ?? 0;
  const humidity = sensors.humidity ?? 0;

  const getRiskLevel = () => {
    if (riskScore > 75) return { 
      level: 'CRITICAL', color: 'text-rose-400', borderColor: 'border-rose-500/30', bgGradient: 'from-rose-500/10', icon: '🔴', gradient: 'from-rose-500 to-red-500'
    };
    if (riskScore > 50) return { 
      level: 'WARNING', color: 'text-orange-400', borderColor: 'border-orange-500/30', bgGradient: 'from-orange-500/10', icon: '🟠', gradient: 'from-orange-500 to-amber-500'
    };
    if (riskScore > 25) return { 
      level: 'MONITORING', color: 'text-amber-400', borderColor: 'border-amber-500/30', bgGradient: 'from-amber-500/10', icon: '🟡', gradient: 'from-amber-500 to-yellow-500'
    };
    return { 
      level: 'HEALTHY', color: 'text-cyan-400', borderColor: 'border-cyan-500/30', bgGradient: 'from-cyan-500/10', icon: '🟢', gradient: 'from-cyan-500 to-emerald-500'
    };
  };

  const riskLevel = getRiskLevel();
  
  const getSensorBreakdown = () => {
    switch(assetType) {
      case 'bridge':
        return [
          { name: 'Vibration', value: vibration, max: 100, unit: 'm/s²', icon: '📈', color: 'from-cyan-500 to-cyan-400', percentage: Math.min((vibration / 100) * 100, 100) },
          { name: 'Crack', value: crack, max: 25, unit: 'mm', icon: '🔍', color: 'from-amber-400 to-orange-400', percentage: Math.min((crack / 25) * 100, 100) },
          { name: 'Load', value: load, max: 100, unit: 'MN', icon: '⚖️', color: 'from-purple-400 to-pink-400', percentage: Math.min((load / 100) * 100, 100) },
        ];
      case 'building':
        return [
          { name: 'Tilt', value: tilt, max: 5, unit: '°', icon: '📐', color: 'from-purple-400 to-violet-400', percentage: Math.min((tilt / 5) * 100, 100) },
          { name: 'Displacement', value: displacement, max: 50, unit: 'mm', icon: '↔️', color: 'from-violet-400 to-purple-400', percentage: Math.min((displacement / 50) * 100, 100) },
          { name: 'Crack', value: crack, max: 20, unit: 'mm', icon: '🔍', color: 'from-amber-400 to-orange-400', percentage: Math.min((crack / 20) * 100, 100) },
        ];
      case 'tunnel':
        return [
          { name: 'Water Pressure', value: waterPressure, max: 100, unit: 'kPa', icon: '💧', color: 'from-blue-400 to-cyan-400', percentage: Math.min((waterPressure / 100) * 100, 100) },
          { name: 'Humidity', value: humidity, max: 100, unit: '%', icon: '💨', color: 'from-sky-400 to-teal-400', percentage: Math.min((humidity / 100) * 100, 100) },
          { name: 'Crack', value: crack, max: 15, unit: 'mm', icon: '🔍', color: 'from-amber-400 to-orange-400', percentage: Math.min((crack / 15) * 100, 100) },
        ];
      default:
        return [];
    }
  };

  const sensorBreakdown = getSensorBreakdown();
  const getFormula = () => {
    switch(assetType) {
      case 'bridge': return 'Risk = (V × 0.4) + (C × 0.3) + (L × 0.3)';
      case 'building': return 'Risk = (T × 0.35) + (D × 0.3) + (C × 0.35)';
      case 'tunnel': return 'Risk = (WP × 0.3) + (H × 0.2) + (C × 0.25)';
      default: return 'Structural Health Index';
    }
  };

  return (
    <div className={`glass-card p-5 border ${riskLevel.borderColor}`}>
      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-3">
        <span className="w-9 h-9 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-lg">📊</span>
        <span>Risk Assessment</span>
      </h3>
      
      <div className="flex justify-center mb-5">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle cx="56" cy="56" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
            <circle cx="56" cy="56" r="50" stroke="url(#riskGradientNew)" strokeWidth="8" fill="none" strokeDasharray={`${(riskScore / 100) * 314.15} 314.15`} className="transition-all duration-1000" strokeLinecap="round" />
            <defs>
              <linearGradient id="riskGradientNew" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={riskScore > 50 ? "#f43f5e" : "#06b6d4"} />
                <stop offset="100%" stopColor={riskScore > 50 ? "#f97316" : "#10b981"} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <p className={`text-3xl font-bold ${riskLevel.color}`}>{riskScore.toFixed(0)}</p>
            <p className="text-xs text-slate-500">/ 100</p>
          </div>
        </div>
      </div>

      <div className={`text-center mb-4 py-2.5 px-4 rounded-xl ${riskLevel.bgGradient} border ${riskLevel.borderColor}`}>
        <p className={`text-sm font-bold ${riskLevel.color} flex items-center justify-center gap-2`}>
          <span>{riskLevel.icon}</span>
          <span>{riskLevel.level} RISK</span>
        </p>
      </div>

      <div className="space-y-3 mb-4">
        {sensorBreakdown.map((sensor, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">{sensor.icon}</span>
                <span className="text-xs font-semibold text-slate-400">{sensor.name}</span>
              </div>
              <span className="font-bold text-white text-sm font-mono">{sensor.value.toFixed(1)}{sensor.unit}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div className={`h-1.5 rounded-full bg-gradient-to-r ${sensor.color} transition-all duration-700`} style={{ width: `${sensor.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
        <p className="text-xs text-slate-400 font-mono text-center">
          <span className="text-cyan-400 font-bold">📐 Formula:</span> {getFormula()}
        </p>
      </div>
    </div>
  );
};

export default RiskMeter;

