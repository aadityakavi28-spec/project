import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, WrenchIcon, BoltIcon, GlobeAltIcon, CheckBadgeIcon, ClockIcon, EyeIcon, RocketLaunchIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      title: 'Real-time Monitoring',
      description: 'Monitor bridge vibration, load, and stress with live sensor data',
      icon: <ChartBarIcon className="h-10 w-10 mx-auto text-primary-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-primary-50 to-primary-100 border-primary-200',
      hoverGradient: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Predictive Maintenance',
      description: 'AI-powered maintenance recommendations to prevent failures',
      icon: <WrenchIcon className="h-10 w-10 mx-auto text-emerald-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-emerald-50 to-emerald-100 border-emerald-200',
      hoverGradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Risk Assessment',
      description: 'Advanced algorithms detect structural risks early and accurately',
      icon: <BoltIcon className="h-10 w-10 mx-auto text-amber-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-amber-50 to-amber-100 border-amber-200',
      hoverGradient: 'from-amber-500 to-amber-600'
    },
    {
      title: '3D Digital Twin',
      description: 'Interactive 3D visualization of your entire bridge infrastructure',
      icon: <GlobeAltIcon className="h-10 w-10 mx-auto text-violet-500 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-violet-50 to-violet-100 border-violet-200',
      hoverGradient: 'from-violet-500 to-violet-600'
    },
  ];

  const stats = [
    { number: '99.9%', label: 'Uptime Guarantee', color: 'text-primary-600', bg: 'bg-primary-50' },
    { number: '24/7', label: 'Real-time Monitoring', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { number: '<2s', label: 'Alert Response Time', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="/logo.svg" alt="Smart Bridge" className="h-9 w-auto group-hover:scale-105 transition-transform duration-300" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Smart Bridge</h1>
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <Link to="/login" className="px-5 py-2.5 text-text-secondary hover:text-primary-600 font-semibold transition-colors duration-300">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 text-sm font-semibold mb-6 animate-fade-in">
            <SparklesIcon className="h-4 w-4" />
            <span>Next-Gen Infrastructure Monitoring</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
            Smart Bridge<br />
            <span className="bg-gradient-to-r from-primary-500 via-violet-500 to-primary-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
              Digital Twin Platform
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced structural health monitoring and predictive maintenance for critical infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/login"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              <span>Start Free Trial</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 bg-white text-text-primary font-semibold rounded-xl transition-all duration-300 border-2 border-slate-200 hover:border-primary-300 hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
              <EyeIcon className="h-5 w-5" />
              <span>View Demo</span>
            </Link>
          </div>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="relative mb-20">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 via-violet-400 to-primary-400 rounded-3xl blur-2xl opacity-30"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="ml-4 text-sm text-text-muted font-medium">Smart Bridge Dashboard</span>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🌉</div>
                <p className="text-text-secondary font-medium">Interactive Dashboard Preview</p>
                <p className="text-text-muted text-sm mt-2">Login to see full dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="card-professional p-8 mb-16 border-l-4 border-l-primary-500">
          <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
            <CheckBadgeIcon className="h-7 w-7 text-primary-500" />
            <span>Why Smart Bridge Digital Twin?</span>
          </h2>
          <p className="text-text-secondary leading-relaxed text-lg">
            Critical infrastructure like bridges requires continuous monitoring to ensure public safety. 
            Our platform uses real-time sensor data and AI analysis to detect structural issues before they become critical, 
            enabling predictive maintenance and reducing downtime and costs.
          </p>
        </div>

        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group card-professional p-6 cursor-pointer transform hover:-translate-y-1"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:${feature.hoverGradient} transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="card-professional p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl ${index === 0 ? '📊' : index === 1 ? '⏰' : '⚡'}`}></span>
              </div>
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
              <div className="text-text-secondary font-medium">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="relative">
          <div className="absolute -inset-6 bg-gradient-to-r from-primary-400 via-violet-400 to-primary-400 rounded-3xl blur-3xl opacity-20"></div>
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 p-10 text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-4 flex items-center justify-center gap-3">
              <RocketLaunchIcon className="h-7 w-7 text-primary-500" />
              <span>Ready to Get Started?</span>
            </h2>
            <p className="text-text-secondary mb-8 text-lg">Join the infrastructure revolution with real-time bridge monitoring</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4"
              >
                Create Free Account
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 bg-white text-text-primary font-semibold rounded-xl transition-all duration-300 border-2 border-slate-200 hover:border-primary-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 mt-20 py-8 text-center">
        <p className="text-text-muted">&copy; 2026 Smart Bridge Digital Twin Platform. <span className="text-primary-500 font-medium">Built for Hackathon</span></p>
      </footer>
    </div>
  );
};

export default LandingPage;
