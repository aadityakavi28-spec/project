import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = ({ inDashboard = false }) => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'monitoring',
      title: 'Real-time Structural Monitoring',
      description: 'Monitor bridge vibration, load, and stress in real-time with advanced sensor integration',
      icon: '📊',
      color: 'from-blue-600 to-blue-700',
      details: [
        'Live vibration analysis',
        'Load measurement sensors',
        'Stress distribution monitoring',
      ]
    },
    {
      id: 'maintenance',
      title: 'Predictive Maintenance',
      description: 'Get AI-powered maintenance recommendations based on wear patterns and sensor data',
      icon: '🔧',
      color: 'from-green-600 to-green-700',
      details: [
        'Maintenance scheduling',
        'Equipment health prediction',
        'Failure risk analysis',
      ]
    },
    {
      id: 'risk-assessment',
      title: 'AI-based Risk Assessment',
      description: 'Advanced algorithms detect structural risks early with machine learning capabilities',
      icon: '🤖',
      color: 'from-purple-600 to-purple-700',
      details: [
        'Machine learning algorithms',
        'Pattern recognition',
        'Anomaly detection',
      ]
    },
    {
      id: 'visualization',
      title: '3D Digital Twin Visualization',
      description: 'Interactive 3D model of your bridge infrastructure with detailed overlay data',
      icon: '🌐',
      color: 'from-orange-600 to-orange-700',
      details: [
        'Interactive 3D model',
        'Real-time data overlay',
        'Component analysis',
      ]
    },
  ];

  const handleFeatureClick = (featureId) => {
    navigate(`/feature/${featureId}`);
  };

  const handleViewAll = () => {
    navigate('/features');
  };

  return (
    <div className={inDashboard ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'}>
      <div className={inDashboard ? 'mb-8' : 'text-center mb-12'}>
        <h2 className={`font-bold text-white ${inDashboard ? 'text-3xl' : 'text-4xl'} mb-4`}>
          Key Features
        </h2>
        {!inDashboard && (
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Explore all the powerful features of Smart Bridge Digital Twin Platform
          </p>
        )}
      </div>

      <div className={`grid ${inDashboard ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => handleFeatureClick(feature.id)}
            className="cursor-pointer transform transition hover:scale-105 active:scale-95"
          >
            <div className={`bg-gradient-to-br ${feature.color} rounded-lg p-8 shadow-2xl h-full hover:shadow-purple-500/50 transition`}>
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-100 text-sm mb-4">{feature.description}</p>
              
              <div className="mb-6 space-y-1">
                {feature.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-blue-50">
                    <span className="text-lg">✓</span>
                    <span className="text-xs">{detail}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold rounded-lg transition border border-white border-opacity-30 text-sm">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {inDashboard && (
        <div className="text-center mt-8">
          <button
            onClick={handleViewAll}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition transform hover:scale-105"
          >
            View All Features
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturesSection;
