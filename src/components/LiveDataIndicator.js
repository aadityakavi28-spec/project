import React from 'react';

const LiveDataIndicator = ({
  isConnected = true,
  lastUpdateTime = null,
  isFetching = false,
  apiCallCount = 0,
  successRate = 100,
  dataSource = { simulation: { connected: true }, weather: { connected: true }, earthquake: { connected: true } },
  nextUpdateCountdown = 10
}) => {
  // Ensure safe values
  const safeIsConnected = isConnected === true || isConnected === undefined || isConnected === null;
  const safeDataSource = dataSource || { simulation: { connected: true }, weather: { connected: true }, earthquake: { connected: true } };
  const safeLastUpdateTime = lastUpdateTime || new Date().toLocaleTimeString();

  return (
    <div className="card-professional p-4 mb-6 border-l-4 border-l-primary-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            safeIsConnected 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'bg-amber-50 text-amber-700'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${
              safeIsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}></div>
            <span className="text-sm font-semibold">
              {safeIsConnected ? '🟢 Live Data Connected' : '🟡 Backup Mode'}
            </span>
          </div>
          {safeLastUpdateTime && (
            <span className="text-sm text-text-muted">
              Last update: {safeLastUpdateTime}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">Next update in:</span>
            <span className="font-bold text-primary-600">{nextUpdateCountdown || 10}s</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${safeDataSource.simulation?.connected ? '' : 'opacity-40'}`}>🔬</span>
            <span className={`text-2xl ${safeDataSource.weather?.connected ? '' : 'opacity-40'}`}>🌍</span>
            <span className={`text-2xl ${safeDataSource.earthquake?.connected ? '' : 'opacity-40'}`}>📍</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDataIndicator;
