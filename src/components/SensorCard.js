import React from 'react';

const SensorCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  min, 
  max, 
  threshold 
}) => {
  // Determine color based on threshold - Light Theme
  const getCardStyle = () => {
    if (threshold && value > threshold) {
      return 'border-rose-300 bg-gradient-to-br from-white to-rose-50 hover:shadow-rose-100/50';
    }
    if (value > (max * 0.75)) {
      return 'border-amber-300 bg-gradient-to-br from-white to-amber-50 hover:shadow-amber-100/50';
    }
    return 'border-slate-200 bg-gradient-to-br from-white to-primary-50/30 hover:shadow-primary-100/50';
  };

  const getValueColor = () => {
    if (threshold && value > threshold) {
      return 'text-rose-600';
    }
    if (value > (max * 0.75)) {
      return 'text-amber-600';
    }
    return 'text-primary-600';
  };

  const getProgressColor = () => {
    if (threshold && value > threshold) {
      return 'bg-gradient-to-r from-rose-500 to-rose-400';
    }
    if (value > (max * 0.75)) {
      return 'bg-gradient-to-r from-amber-500 to-amber-400';
    }
    return 'bg-gradient-to-r from-primary-500 to-primary-400';
  };

  const getProgressBgColor = () => {
    if (threshold && value > threshold) {
      return 'bg-rose-100';
    }
    if (value > (max * 0.75)) {
      return 'bg-amber-100';
    }
    return 'bg-slate-100';
  };

  const getIconBg = () => {
    if (threshold && value > threshold) {
      return 'bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600';
    }
    if (value > (max * 0.75)) {
      return 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600';
    }
    return 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600';
  };

  return (
    <div className={`card-professional p-6 border-2 ${getCardStyle()} transform hover:-translate-y-1 transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-text-secondary group-hover:text-text-primary transition-colors duration-300">
          {title}
        </h3>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${getIconBg()}`}>
          {icon}
        </div>
      </div>
      
      <div className="mb-5">
        <p className={`text-4xl font-extrabold ${getValueColor()} transition-colors duration-300 tracking-tight`}>
          {value.toFixed(1)}
        </p>
        <p className="text-sm text-text-muted mt-1.5 font-medium">{unit}</p>
      </div>

      {/* Progress bar */}
      <div className={`w-full ${getProgressBgColor()} rounded-full h-2.5 overflow-hidden mb-4`}>
        <div
          className={`h-2.5 rounded-full transition-all duration-700 shadow-sm ${getProgressColor()}`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-text-muted font-medium">
        <span>Min: {min.toFixed(1)}</span>
        <span>Max: {max.toFixed(1)}</span>
      </div>

      {/* Threshold indicator */}
      {threshold && (
        <div className={`mt-4 px-3 py-2 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 ${
          value > threshold 
            ? 'bg-rose-100 text-rose-600 border border-rose-200'
            : 'bg-amber-100 text-amber-600 border border-amber-200'
        }`}>
          {value > threshold ? '⚠️' : '👁️'} 
          Threshold: {threshold.toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default SensorCard;
