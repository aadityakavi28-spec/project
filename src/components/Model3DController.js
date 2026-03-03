// ============================================================
// MODEL 3D CONTROLLER
// Centralized highlighting controller for all 3D asset models
// No geometry modification - only visual properties change
// ============================================================

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useAsset } from '../context/AssetContext';
import { useAuth } from '../utils/AuthContext';

// Lazy load 3D models for better performance
const BridgeModel = lazy(() => import('./BridgeModel'));
const BuildingModel = lazy(() => import('./BuildingModel'));
const TunnelModel = lazy(() => import('./TunnelModel'));

// ============================================================
// COLOR CONSTANTS (Universal system)
// ============================================================
export const HIGHLIGHT_COLORS = {
  SAFE: '#34c759',      // Green - Healthy
  MONITORING: '#fbbf24', // Yellow - Moderate
  WARNING: '#f97316',    // Orange - Warning  
  CRITICAL: '#ff3b30', // Red - Critical
};

// ============================================================
// HIGHLIGHT CONTROLLER
// ============================================================
export const getHighlightColor = (riskScore) => {
  if (!riskScore || riskScore < 0) return HIGHLIGHT_COLORS.SAFE;
  if (riskScore < 25) return HIGHLIGHT_COLORS.SAFE;
  if (riskScore < 50) return HIGHLIGHT_COLORS.MONITORING;
  if (riskScore < 75) return HIGHLIGHT_COLORS.WARNING;
  return HIGHLIGHT_COLORS.CRITICAL;
};

export const getHighlightEmissiveIntensity = (riskScore) => {
  if (!riskScore || riskScore < 50) return 0;
  if (riskScore < 75) return 0.3;
  if (riskScore < 90) return 0.6;
  return 1.0;
};

// ============================================================
// MODEL LOADER COMPONENT
// ============================================================
const Model3DController = ({ 
  showHighlights = true,
  onSensorClick 
}) => {
  const { assetType, sensorData, riskScore } = useAsset();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Safe fallback for sensor data
  const safeSensorData = useMemo(() => {
    return sensorData || {};
  }, [sensorData]);

  // Safe fallback for risk score
  const safeRiskScore = useMemo(() => {
    return typeof riskScore === 'number' && !isNaN(riskScore) ? riskScore : 50;
  }, [riskScore]);

  // Determine which model to render based on asset type
  const renderModel = () => {
    const modelProps = {
      // Only pass highlight props if showHighlights is enabled
      ...(showHighlights && {
        showHighlights: true,
        highlightColor: getHighlightColor(safeRiskScore),
        emissiveIntensity: getHighlightEmissiveIntensity(safeRiskScore),
      }),
      // Always pass sensor data with fallbacks
      riskScore: safeRiskScore,
      vibration: safeSensorData.vibration ?? 0,
      load: safeSensorData.load ?? 0,
      crack: safeSensorData.crack ?? 0,
      temperature: safeSensorData.temperature ?? 0,
      tilt: safeSensorData.tilt ?? 0,
      displacement: safeSensorData.displacement ?? 0,
      waterPressure: safeSensorData.waterPressure ?? 0,
      humidity: safeSensorData.humidity ?? 0,
      structuralStrain: safeSensorData.structuralStrain ?? 0,
      isRisk: safeRiskScore > 75,
    };

    switch (assetType) {
      case 'bridge':
        return <BridgeModel {...modelProps} onSensorClick={onSensorClick} />;
      case 'building':
        return <BuildingModel {...modelProps} onSensorClick={onSensorClick} />;
      case 'tunnel':
        return <TunnelModel {...modelProps} onSensorClick={onSensorClick} />;
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <div className="text-white text-center">
              <p className="text-xl font-semibold">No Asset Selected</p>
              <p className="text-sm text-gray-400 mt-2">Select an asset from Command Center</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center bg-slate-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading 3D Model...</p>
        </div>
      </div>
    }>
    
      {renderModel()}
    </Suspense>
  );
};

// ============================================================
// ADMIN LEGEND PANEL COMPONENT
// ============================================================
export const StressLegendPanel = ({ showHighlights, onToggle }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) return null;

  return (
    <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-lg">
      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <span>🎨</span> Structural Risk Legend
      </h4>
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-300">Safe (0-25)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
          <span className="text-xs text-gray-300">Moderate (25-50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
          <span className="text-xs text-gray-300">High (50-75)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-xs text-gray-300">Critical (75-100)</span>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showHighlights}
          onChange={(e) => {
            if (onToggle) onToggle(e.target.checked);
          }}
          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500"
        />
        <span className="text-xs text-gray-300">Show Stress Zones</span>
      </label>
    </div>
  );
};

// ============================================================
// EXPORTS
// ============================================================
export default Model3DController;

