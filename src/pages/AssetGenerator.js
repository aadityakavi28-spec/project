// ============================================================
// ASSET GENERATOR PAGE
// AI-Assisted Parametric Digital Twin Generation System
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useAsset } from '../context/AssetContext';
import { processLocation } from '../utils/geolocationService';
import { generateStructuralParams } from '../utils/aiParamService';
import ParametricModel from '../components/ParametricModel';
import Navbar from '../components/Navbar';

const AssetGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initializeAsset } = useAsset();
  
  // Check if admin
  const isAdmin = user?.role === 'admin';
  
  // Form state
  const [step, setStep] = useState(1); // 1: Input, 2: Processing, 3: Refine, 4: Preview
  const [assetName, setAssetName] = useState('');
  const [location, setLocation] = useState('');
  const [assetType, setAssetType] = useState('bridge');
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState('');
  
  // Result state
  const [geolocationResult, setGeolocationResult] = useState(null);
  const [structuralParams, setStructuralParams] = useState(null);
  const [refinedParams, setRefinedParams] = useState(null);
  
  // Validation
  const isFormValid = assetName.trim() && location.trim() && 
    ['bridge', 'building', 'tunnel'].includes(assetType);

  // Handle generate
  const handleGenerate = async () => {
    if (!isFormValid) return;
    
    setIsProcessing(true);
    setError('');
    setStep(2);
    
    try {
      // Step 1: Geolocation
      setProcessingStatus('📍 Processing location...');
      const geoResult = await processLocation(location, assetType);
      
      if (!geoResult.success) {
        setError(geoResult.error || 'Location processing failed');
      }
      
      setGeolocationResult(geoResult);
      
      // Step 2: AI Parameter Generation
      setProcessingStatus('🤖 Generating structural parameters...');
      const params = await generateStructuralParams(assetName, assetType, geoResult.metadata || {});
      
      setStructuralParams(params);
      setRefinedParams(params);
      
      // Complete
      setProcessingStatus('✅ Generation complete!');
      setStep(3);
      
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate model. Using default parameters.');
      
      // Fallback to defaults
      setStructuralParams(getDefaultParams(assetType));
      setRefinedParams(getDefaultParams(assetType));
      setStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle parameter change
  const handleParamChange = (key, value) => {
    setRefinedParams(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle finalize and add to dashboard
  const handleFinalize = () => {
    // Create asset object
    const newAsset = {
      id: `generated-${Date.now()}`,
      name: assetName,
      location: location,
      type: assetType,
      status: 'active',
      parametricConfig: refinedParams,
      coordinates: geolocationResult?.coordinates,
    };
    
    // Initialize in context and navigate
    initializeAsset(assetType, newAsset);
    navigate('/dashboard');
  };

  // Render refinement controls based on asset type
  const renderRefinementControls = () => {
    if (!refinedParams) return null;

    switch (assetType) {
      case 'building':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Floors: {refinedParams.estimatedFloors}
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={refinedParams.estimatedFloors}
                onChange={(e) => handleParamChange('estimatedFloors', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Height: {refinedParams.estimatedHeight}m
              </label>
              <input
                type="range"
                min="5"
                max="200"
                value={refinedParams.estimatedHeight}
                onChange={(e) => handleParamChange('estimatedHeight', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Column Density: {refinedParams.columnDensity}
              </label>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.05"
                value={refinedParams.columnDensity}
                onChange={(e) => handleParamChange('columnDensity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Style</label>
              <select
                value={refinedParams.structuralStyle}
                onChange={(e) => handleParamChange('structuralStyle', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="rectangular">Rectangular</option>
                <option value="tower">Tower</option>
                <option value="modern">Modern</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
          </div>
        );

      case 'bridge':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Span Count: {refinedParams.spanCount}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={refinedParams.spanCount}
                onChange={(e) => handleParamChange('spanCount', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Length: {refinedParams.estimatedLength}m
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={refinedParams.estimatedLength}
                onChange={(e) => handleParamChange('estimatedLength', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Deck Width: {refinedParams.deckWidth}m
              </label>
              <input
                type="range"
                min="6"
                max="25"
                value={refinedParams.deckWidth}
                onChange={(e) => handleParamChange('deckWidth', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bridge Type</label>
              <select
                value={refinedParams.bridgeType}
                onChange={(e) => handleParamChange('bridgeType', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="beam">Beam Bridge</option>
                <option value="arch">Arch Bridge</option>
                <option value="suspension">Suspension Bridge</option>
              </select>
            </div>
          </div>
        );

      case 'tunnel':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Diameter: {refinedParams.diameter}m
              </label>
              <input
                type="range"
                min="4"
                max="15"
                value={refinedParams.diameter}
                onChange={(e) => handleParamChange('diameter', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Length: {refinedParams.length}m
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={refinedParams.length}
                onChange={(e) => handleParamChange('length', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Segment Count: {refinedParams.segmentCount}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={refinedParams.segmentCount}
                onChange={(e) => handleParamChange('segmentCount', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Lanes</label>
              <select
                value={refinedParams.lanes}
                onChange={(e) => handleParamChange('lanes', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="1">1 Lane</option>
                <option value="2">2 Lanes</option>
                <option value="3">3 Lanes</option>
                <option value="4">4 Lanes</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🏗️ AI-Assisted Structural Twin Generation
          </h1>
          <p className="text-gray-400">
            Create parametric digital twins by entering asset details. The system will generate a realistic 3D model.
          </p>
        </div>

        {/* Step 1: Input Form */}
        {step === 1 && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Step 1: Enter Asset Details</h2>
            
            <div className="space-y-4 max-w-xl">
              {/* Asset Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g., City Central Tower, Golden Gate Bridge"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location (City/Address) *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, Delhi, London"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Asset Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Asset Type *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { type: 'bridge', icon: '🌉', label: 'Bridge' },
                    { type: 'building', icon: '🏢', label: 'Building' },
                    { type: 'tunnel', icon: '🚇', label: 'Tunnel' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => setAssetType(item.type)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        assetType === item.type
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{item.icon}</span>
                      <span className="text-white font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isFormValid
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                    : 'bg-slate-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                🚀 Generate Parametric Model
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Processing...</h2>
            <p className="text-xl text-gray-300 mb-2">{processingStatus}</p>
            {error && <p className="text-amber-400 mt-4">{error}</p>}
          </div>
        )}

        {/* Step 3: Refine & Preview */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Refinement Controls */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Step 2: Refine Parameters</h2>
              <p className="text-gray-400 mb-6">
                Adjust the parameters below. The 3D model will update in real-time.
              </p>
              
              {renderRefinementControls()}
              
              <div className="mt-6 pt-6 border-t border-slate-700">
                <button
                  onClick={handleFinalize}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-lg text-white hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  ✅ Add to Monitoring Dashboard
                </button>
              </div>
            </div>

            {/* 3D Preview */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">3D Preview</h2>
              <div className="rounded-xl overflow-hidden border border-slate-600" style={{ height: '500px' }}>
                <ParametricModel
                  assetType={assetType}
                  params={refinedParams}
                  riskScore={35}
                  showHighlights={true}
                />
              </div>
              
              {/* Model Info */}
              <div className="mt-4 p-4 bg-slate-700 rounded-xl">
                <h3 className="text-white font-semibold mb-2">Generated Parameters</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {refinedParams && Object.entries(refinedParams).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400">{key}:</span>
                      <span className="text-white">{typeof value === 'number' ? value.toFixed(1) : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Default parameters helper
const getDefaultParams = (assetType) => {
  switch (assetType) {
    case 'building':
      return {
        assetType: 'building',
        estimatedFloors: 8,
        estimatedHeight: 32,
        structuralStyle: 'rectangular',
        columnDensity: 0.15,
        baseWidth: 20,
        baseDepth: 20,
      };
    case 'bridge':
      return {
        assetType: 'bridge',
        bridgeType: 'beam',
        spanCount: 2,
        estimatedLength: 100,
        deckWidth: 12,
      };
    case 'tunnel':
      return {
        assetType: 'tunnel',
        diameter: 8,
        segmentCount: 20,
        length: 500,
        lanes: 2,
      };
    default:
      return {};
  }
};

export default AssetGenerator;

