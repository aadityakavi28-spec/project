import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChartBarIcon, WrenchIcon, BoltIcon, GlobeAltIcon, UserGroupIcon, CogIcon, CubeIcon, CurrencyDollarIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../utils/AuthContext';

const FeaturesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isEngineer } = useAuth();

  const features = [
    {
      id: 'monitoring',
      title: 'Real-time Structural Monitoring',
      description: 'Monitor bridge vibration, load, and stress in real-time with advanced sensor integration',
      icon: <ChartBarIcon className="h-10 w-10 text-primary-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-primary-50 to-primary-100 border-primary-200',
      hoverGradient: 'from-primary-500 to-primary-600',
      roles: ['all', 'engineer', 'admin'],
      details: [
        '✓ Live vibration analysis',
        '✓ Load measurement sensors',
        '✓ Stress distribution monitoring',
        '✓ Temperature tracking',
        '✓ Real-time alerts'
      ]
    },
    {
      id: 'maintenance',
      title: 'Predictive Maintenance',
      description: 'Get AI-powered maintenance recommendations based on wear patterns and sensor data',
      icon: <WrenchIcon className="h-10 w-10 text-emerald-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-emerald-50 to-emerald-100 border-emerald-200',
      hoverGradient: 'from-emerald-500 to-emerald-600',
      roles: ['engineer', 'admin'],
      details: [
        '✓ Maintenance scheduling',
        '✓ Equipment health prediction',
        '✓ Failure risk analysis',
        '✓ Service recommendations',
        '✓ Cost optimization'
      ]
    },
    {
      id: 'risk-assessment',
      title: 'AI-based Risk Assessment',
      description: 'Advanced algorithms detect structural risks early with machine learning capabilities',
      icon: <BoltIcon className="h-10 w-10 text-violet-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-violet-50 to-violet-100 border-violet-200',
      hoverGradient: 'from-violet-500 to-violet-600',
      roles: ['engineer', 'admin'],
      details: [
        '✓ Machine learning algorithms',
        '✓ Pattern recognition',
        '✓ Anomaly detection',
        '✓ Risk scoring system',
        '✓ Predictive modeling'
      ]
    },
    {
      id: 'visualization',
      title: '3D Digital Twin Visualization',
      description: 'Interactive 3D model of your bridge infrastructure with detailed overlay data',
      icon: <GlobeAltIcon className="h-10 w-10 text-orange-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-orange-50 to-orange-100 border-orange-200',
      hoverGradient: 'from-orange-500 to-orange-600',
      roles: ['engineer', 'admin'],
      details: [
        '✓ Interactive 3D model',
        '✓ Real-time data overlay',
        '✓ Component analysis',
        '✓ Historical comparison',
        '✓ Custom reporting'
      ]
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Create, edit or remove users and assign roles to staff members',
      icon: <UserGroupIcon className="h-10 w-10 text-pink-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-pink-50 to-pink-100 border-pink-200',
      hoverGradient: 'from-pink-500 to-pink-600',
      roles: ['admin'],
      details: [
        '✓ Add new users',
        '✓ Change user roles',
        '✓ Disable accounts',
        '✓ View user activity logs'
      ]
    },
    {
      id: 'system-config',
      title: 'System Configuration',
      description: 'Adjust global settings, thresholds, and maintenance schedules for the platform',
      icon: <CogIcon className="h-10 w-10 text-blue-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-blue-50 to-blue-100 border-blue-200',
      hoverGradient: 'from-blue-500 to-blue-600',
      roles: ['admin'],
      details: [
        '✓ Set risk thresholds',
        '✓ Configure alert rules',
        '✓ Manage API keys',
        '✓ Notification preferences'
      ]
    },
    {
      id: 'bridge-creation',
      title: 'Bridge Administration',
      description: 'Add new bridges to the system and maintain metadata such as name and location',
      icon: <CubeIcon className="h-10 w-10 text-teal-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-teal-50 to-teal-100 border-teal-200',
      hoverGradient: 'from-teal-500 to-teal-600',
      roles: ['admin'],
      details: [
        '✓ Create bridges',
        '✓ Edit bridge details',
        '✓ Remove obsolete bridges'
      ]
    },
  ];

  const handleFeatureClick = (featureId) => {
    navigate(`/feature/${featureId}`);
  };

  const filteredFeatures = features.filter((f) => {
    if (!isAuthenticated) {
      return f.roles.includes('all');
    }
    if (isAdmin) {
      return true;
    }
    if (isEngineer) {
      return f.roles.includes('engineer') || f.roles.includes('all');
    }
    return f.roles.includes('all');
  });

  const benefitCards = [
    {
      title: 'Real-time Intelligence',
      description: 'Get instant insights into your bridge\'s structural health with continuous monitoring and immediate alerts for critical issues.',
      icon: '⚡',
      color: 'from-primary-50 to-primary-100 border-primary-200'
    },
    {
      title: 'Cost Savings',
      description: 'Reduce maintenance costs by 40% through predictive analytics and optimized maintenance scheduling.',
      icon: '💰',
      color: 'from-emerald-50 to-emerald-100 border-emerald-200'
    },
    {
      title: 'Safety First',
      description: 'Ensure public safety with AI-powered risk detection and early warning systems before failures occur.',
      icon: '🛡️',
      color: 'from-rose-50 to-rose-100 border-rose-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Key <span className="text-gradient">Features</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Explore all the powerful features of Smart Bridge Digital Twin Platform for professional infrastructure monitoring
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-amber-600 mt-3 font-medium">
              Note: Login to see all features available for your role
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredFeatures.map((feature, idx) => {
            const restricted = feature.roles && feature.roles.length === 1 && feature.roles[0] === 'admin' && !isAdmin;
            return (
              <div
                key={feature.id}
                onClick={() => !restricted && handleFeatureClick(feature.id)}
                className={`card-professional p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ${restricted ? 'opacity-50' : ''}`}
                style={{animationDelay: `${idx * 0.05}s`}}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h2>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">{feature.description}</p>
                    {restricted && (
                      <div className="text-xs text-amber-600 font-medium mb-2">Admin only</div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {feature.details.slice(0, 3).map((detail, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-slate-100 rounded-full text-text-secondary font-medium">
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {!restricted && (
                  <div className="mt-4 flex items-center text-primary-500 text-sm font-semibold">
                    <span>Explore Details</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="card-professional p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">Why These Features Matter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefitCards.map((benefit, idx) => (
              <div key={idx} className={`card-elevated p-6 rounded-xl border-2 ${benefit.color} hover:-translate-y-1 transition-transform duration-300`}>
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-text-primary mb-3">{benefit.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;
