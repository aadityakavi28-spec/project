import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = ({ inDashboard = false }) => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'monitoring',
      title: 'Real-time Monitoring',
      description: 'Monitor bridge vibration, load, and stress with live sensor data',
      icon: '📊',
      color: 'from-primary-500 to-primary-600',
      hoverColor: 'hover:shadow-primary-100/50',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600'
    },
    {
      id: 'maintenance',
      title: 'Predictive Maintenance',
      description: 'AI-powered maintenance recommendations to prevent failures',
      icon: '🔧',
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:shadow-emerald-100/50',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Advanced algorithms detect structural risks early and accurately',
      icon: '🤖',
      color: 'from-violet-500 to-violet-600',
      hoverColor: 'hover:shadow-violet-100/50',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    },
    {
      id: 'visualization',
      title: '3D Digital Twin',
      description: 'Interactive 3D visualization of your entire bridge infrastructure',
      icon: '🌐',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:shadow-orange-100/50',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
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
        <h2 className={`font-bold text-text-primary ${inDashboard ? 'text-2xl' : 'text-3xl'} mb-3`}>
          Key Features
        </h2>
        {!inDashboard && (
          <p className="text-text-secondary max-w-2xl mx-auto">
            Powerful features for professional infrastructure monitoring
          </p>
        )}
      </div>

      <div className={`grid ${inDashboard ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-5`}>
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => handleFeatureClick(feature.id)}
            className="cursor-pointer group"
          >
            <div className={`card-professional p-6 h-full ${feature.hoverColor}`}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4 shadow-md transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-text-primary mb-2 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                {feature.description}
              </p>
              <div className={`inline-flex items-center gap-1 text-sm font-semibold ${feature.textColor}`}>
                <span>Learn more</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {inDashboard && (
        <div className="text-center mt-8">
          <button
            onClick={handleViewAll}
            className="btn-secondary inline-flex items-center gap-2"
          >
            View All Features
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturesSection;
