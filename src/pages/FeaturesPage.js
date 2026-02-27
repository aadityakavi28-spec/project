import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const FeaturesPage = () => {
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
        'Temperature tracking',
        'Humidity control system',
        'Real-time alerts'
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
        'Service recommendations',
        'Cost optimization',
        'Work order management'
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
        'Risk scoring system',
        'Predictive modeling',
        'Safety thresholds'
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
        'Structural health view',
        'Historical comparison',
        'Custom reporting'
      ]
    },
  ];

  const handleFeatureClick = (featureId) => {
    navigate(`/feature/${featureId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Key Features</h1>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Explore all the powerful features of Smart Bridge Digital Twin Platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              className="cursor-pointer transform transition hover:scale-105 active:scale-95"
            >
              <div className={`bg-gradient-to-br ${feature.color} rounded-lg p-8 shadow-2xl h-full hover:shadow-purple-500/50 transition`}>
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-3">{feature.title}</h2>
                <p className="text-blue-100 mb-6">{feature.description}</p>
                
                <div className="mb-6 space-y-2">
                  {feature.details.slice(0, 3).map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-blue-50">
                      <span className="text-lg">✓</span>
                      <span className="text-sm">{detail}</span>
                    </div>
                  ))}
                  <div className="text-blue-200 text-sm pt-2">
                    + {feature.details.length - 3} more features
                  </div>
                </div>
                
                <button className="w-full py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold rounded-lg transition border border-white border-opacity-30">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why These Features Matter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-3">⚡ Real-time Intelligence</h3>
              <p className="text-gray-300">Get instant insights into your bridge's structural health with continuous monitoring and immediate alerts for critical issues.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-300 mb-3">💰 Cost Savings</h3>
              <p className="text-gray-300">Reduce maintenance costs by 40% through predictive analytics and optimized maintenance scheduling.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-300 mb-3">🛡️ Safety First</h3>
              <p className="text-gray-300">Ensure public safety with AI-powered risk detection and early warning systems before failures occur.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
