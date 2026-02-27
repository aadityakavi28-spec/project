import React, { useEffect, useState } from 'react';

const LiveDataIndicator = ({ 
  isConnected, 
  lastUpdateTime, 
  isFetching, 
  apiCallCount,
  successRate,
  dataSource,
  nextUpdateCountdown
}) => {
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    if (isFetching) {
      const interval = setInterval(() => {
        setPulseCount(prev => (prev + 1) % 3);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isFetching]);

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-blue-500 border-opacity-50 rounded-lg p-6 mb-6 shadow-2xl">
      {/* Top Row: Connection Status & Fetching */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 1. Connection Status */}
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 border border-blue-500 border-opacity-20">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`}></div>
            <span className="text-xs font-semibold text-gray-400 uppercase">Connection</span>
          </div>
          <p className={`text-lg font-bold ${
            isConnected ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {isConnected ? '🌍 LIVE' : '⚙️ BACKUP'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isConnected ? 'Real-time data' : 'Simulated data'}
          </p>
        </div>

        {/* 2. Fetching Status */}
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 border border-blue-500 border-opacity-20">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              isFetching ? 'bg-blue-500 animate-spin' : 'bg-green-500'
            }`}></div>
            <span className="text-xs font-semibold text-gray-400 uppercase">Status</span>
          </div>
          <p className={`text-lg font-bold ${
            isFetching ? 'text-blue-400' : 'text-green-400'
          }`}>
            {isFetching ? '📨 FETCHING' : '✅ READY'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isFetching ? 'Requesting APIs...' : 'Data synced'}
          </p>
        </div>

        {/* 3. API Calls Count */}
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 border border-purple-500 border-opacity-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">API Calls</span>
          </div>
          <p className="text-lg font-bold text-purple-400">{apiCallCount}</p>
          <p className="text-xs text-gray-500 mt-1">since start</p>
        </div>

        {/* 4. Success Rate */}
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 border border-green-500 border-opacity-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Success</span>
          </div>
          <p className="text-lg font-bold text-green-400">{successRate}%</p>
          <p className="text-xs text-gray-500 mt-1">API success rate</p>
        </div>
      </div>

      {/* Bottom Row: Data Source & Animation */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Data Sources */}
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 border border-blue-500 border-opacity-20">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">📊 Data Sources</p>
          <div className="space-y-2">
            {dataSource.weather && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-300">🌡️ Weather API</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  dataSource.weather.connected 
                    ? 'bg-green-500 bg-opacity-20 text-green-400' 
                    : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                }`}>
                  {dataSource.weather.connected ? 'Active' : 'Offline'}
                </span>
              </div>
            )}
            {dataSource.earthquake && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-300">📍 Earthquake API</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  dataSource.earthquake.connected 
                    ? 'bg-green-500 bg-opacity-20 text-green-400' 
                    : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                }`}>
                  {dataSource.earthquake.connected ? 'Active' : 'Offline'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live Update Animation */}
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 border border-blue-500 border-opacity-20">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">⏱️ Update Cycle</p>
          <div className="flex items-center gap-2 mb-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`h-8 w-1 rounded-full transition-all ${
                  isFetching && pulseCount === index % 3
                    ? 'bg-blue-500 scale-125'
                    : 'bg-blue-500 bg-opacity-30'
                }`}
              ></div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-3 text-center mb-2">
            <p className="text-2xl font-bold text-white">{nextUpdateCountdown}s</p>
            <p className="text-xs text-blue-100">Next fetch</p>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Last update: {lastUpdateTime || '--:--:--'}
          </p>
        </div>
      </div>

      {/* Live Data Stream Animation */}
      <div className="mt-6 bg-slate-800 rounded-lg p-4 border border-blue-500 border-opacity-20 overflow-hidden">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-3">🌐 Live Data Stream</p>
        <div className="flex items-center gap-2 h-6">
          {isFetching ? (
            <>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-xs text-blue-400 ml-2">Fetching real-time data...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-400">Data synchronized ✓</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveDataIndicator;
