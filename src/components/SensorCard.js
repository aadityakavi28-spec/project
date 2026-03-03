
import React from 'react';

const SensorCard = ({ title, value, unit, icon, min, max, threshold }) => {
  const getCardStyle = () => {
    if (threshold && value > threshold) {
      return 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50';
    }
    if (value > (max * 0.75)) {
      return 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50';
    }
    return 'border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-500/50';
  };

  const getValueColor = () => {
    if (threshold && value > threshold) {
      return 'text-rose-400';
    }
    if (value > (max * 0.75)) {
      return 'text-amber-400';
    }
    return 'text-cyan-400';
  };

  const getProgressColor = () => {
    if (threshold && value > threshold) {
      return 'bg-gradient-to-r from-rose-500 to-rose-400';
    }
    if (value > (max * 0.75)) {
      return 'bg-gradient-to-r from-amber-500 to-amber-400';
    }
    return 'bg-gradient-to-r from-cyan-500 to-cyan-400';
  };

  const getProgressBgColor = () => {
    if (threshold && value > threshold) {
      return 'bg-rose-500/10';
    }
    if (value > (max * 0.75)) {
      return 'bg-amber-500/10';
    }
    return 'bg-cyan-500/10';
  };

  const getIconBg = () => {
    if (threshold && value > threshold) {
      return 'bg-gradient-to-br from-rose-500/20 to-rose-400/10 text-rose-400';
    }
    if (value > (max * 0.75)) {
      return 'bg-gradient-to-br from-amber-500/20 to-amber-400/10 text-amber-400';
    }
    return 'bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 text-cyan-400';
  };

  return (
    <div className={`glass-card p-5 border ${getCardStyle()} transform hover:-translate-y-1 transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
          {title}
        </h3>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${getIconBg()}`}>
          {icon}
        </div>
      </div>
      
      <div className="mb-4">
        <p className={`text-3xl font-bold ${getValueColor()} transition-colors duration-300 tracking-tight font-mono`}>
          {value.toFixed(1)}
        </p>
        <p className="text-xs text-slate-500 mt-1 font-medium">{unit}</p>
      </div>

      <div className={`w-full ${getProgressBgColor()} rounded-full h-1.5 overflow-hidden mb-3`}>
        <div className={`h-1.5 rounded-full transition-all duration-700 shadow-sm ${getProgressColor()}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
      </div>

      <div className="flex justify-between text-xs text-slate-500 font-medium">
        <span>Min: {min.toFixed(1)}</span>
        <span>Max: {max.toFixed(1)}</span>
      </div>

      {threshold && (
        <div className={`mt-4 px-3 py-2 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 ${
          value > threshold 
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
        }`}>
          {value > threshold ? '⚠️' : '👁️'} 
          Threshold: {threshold.toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default SensorCard;

