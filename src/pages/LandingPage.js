import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      title: 'Real-time Structural Monitoring',
      description: 'Monitor bridge vibration, load, and stress in real-time',
      icon: '📊',
    },
    {
      title: 'Predictive Maintenance',
      description: 'Get AI-powered maintenance recommendations',
      icon: '🔧',
    },
    {
      title: 'AI-based Risk Assessment',
      description: 'Advanced algorithms detect structural risks early',
      icon: '🤖',
    },
    {
      title: '3D Digital Twin Visualization',
      description: 'Interactive 3D model of your bridge infrastructure',
      icon: '🌐',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900 bg-opacity-50 backdrop-blur-md border-b border-blue-500 border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">🌉 SB Digital Twin</div>
          <div className="space-x-4">
            <Link to="/login" className="px-6 py-2 text-white hover:text-blue-300 transition">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 text-white hover:text-blue-300 transition">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Smart Bridge<br />Digital Twin Platform
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Advanced structural health monitoring and predictive maintenance for critical infrastructure.
            Detect risks early with AI-powered analysis and real-time sensor data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/login"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition transform hover:scale-105"
            >
              Login to Dashboard
            </Link>
            <Link
              to="/demo"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition transform hover:scale-105 border border-blue-500"
            >
              View Demo Dashboard
            </Link>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-8 mb-20">
          <h2 className="text-2xl font-bold text-white mb-4">Why Smart Bridge Digital Twin?</h2>
          <p className="text-gray-300 leading-relaxed">
            Critical infrastructure like bridges requires continuous monitoring to ensure public safety. 
            Traditional inspection methods are manual, expensive, and often miss emerging problems. 
            Our Smart Bridge Digital Twin Platform uses real-time sensor data and AI analysis to 
            detect structural issues before they become critical, enabling predictive maintenance 
            and reducing downtime and costs.
          </p>
        </div>

        {/* Features Section */}
        <section>
          <h2 className="text-4xl font-bold text-white text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6 hover:bg-opacity-70 transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Monitor Your Bridge?</h2>
          <p className="text-blue-100 mb-8">Get started with our platform in minutes</p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Create Account
          </Link>
        </section>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500 border-opacity-30 mt-20 py-8 text-center text-gray-400">
        <p>&copy; 2026 Smart Bridge Digital Twin Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
