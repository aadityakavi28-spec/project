
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  WrenchIcon, 
  BoltIcon, 
  GlobeAltIcon, 
  CheckBadgeIcon, 
  ShieldCheckIcon, 
  CpuChipIcon,
  ArrowRightIcon,
  SparklesIcon,
  EyeIcon,
  BuildingOffice2Icon,
  CubeTransparentIcon,
  SignalIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      title: 'AI-Powered Analytics',
      description: 'Machine learning algorithms analyze structural data in real-time to predict failures before they occur',
      icon: <CpuChipIcon className="h-10 w-10" />,
      color: 'cyan'
    },
    {
      title: 'Digital Twin Visualization',
      description: 'Interactive 3D models of bridges, buildings, and tunnels with live sensor overlay',
      icon: <CubeTransparentIcon className="h-10 w-10" />,
      color: 'purple'
    },
    {
      title: 'Real-time Monitoring',
      description: '24/7 sensor monitoring with instant alerts and automated risk assessment',
      icon: <SignalIcon className="h-10 w-10" />,
      color: 'pink'
    },
    {
      title: 'Cloud Integration',
      description: 'Scalable cloud infrastructure for processing millions of data points per second',
      icon: <CloudIcon className="h-10 w-10" />,
      color: 'lime'
    },
  ];

  const stats = [
    { number: '10K+', label: 'Sensors Monitored', icon: '📡' },
    { number: '99.9%', label: 'Uptime SLA', icon: '⚡' },
    { number: '<100ms', label: 'Latency', icon: '🚀' },
    { number: '50+', label: 'Asset Types', icon: '🏗️' },
  ];

  const assetTypes = [
    { type: 'Bridges', count: '2,500+', icon: '🌉', color: 'from-cyan-500 to-blue-500' },
    { type: 'Buildings', count: '8,000+', icon: '🏢', color: 'from-purple-500 to-pink-500' },
    { type: 'Tunnels', count: '1,200+', icon: '🚇', color: 'from-lime-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 hero-cyber grid-pattern">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <BuildingOffice2Icon className="h-7 w-7 text-slate-900" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-cyan-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-neon">StructuraX</h1>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 text-slate-300 hover:text-white font-medium transition-colors">
              Login
            </Link>
            <Link to="/register" className="btn-neon">
              <span>Get Started</span>
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm font-semibold mb-8 animate-fade-in">
              <SparklesIcon className="h-4 w-4" />
              <span>Next-Gen Infrastructure Intelligence</span>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-white">Monitor </span>
              <span className="text-gradient-neon">Infrastructure</span>
              <br />
              <span className="text-white">Like Never </span>
              <span className="text-gradient-warm">Before</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              AI-powered digital twin platform for bridges, buildings, and tunnels. 
              Real-time monitoring, predictive maintenance, and instant alerts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
              <Link to="/login" className="btn-neon text-lg px-10 py-5">
                <span>Start Free Trial</span>
                <ArrowRightIcon className="h-6 w-6 ml-2" />
              </Link>
              <Link to="/demo" className="btn-cyber text-lg px-10 py-5">
                <span>View Demo</span>
                <EyeIcon className="h-6 w-6 ml-2" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="glass-card-hover px-8 py-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mt-20">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-30 blur-2xl"></div>
            <div className="relative glass-card overflow-hidden">
              <div className="bg-slate-900/80 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="ml-4 text-sm text-slate-400 font-mono">StructuraX Dashboard v2.0</span>
              </div>
              
              <div className="p-8 min-h-[500px] relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-30"></div>
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {assetTypes.map((asset, index) => (
                    <div 
                      key={index}
                      className="glass-card-hover p-6"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${asset.color} flex items-center justify-center text-3xl mb-4`}>
                        {asset.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{asset.type}</h3>
                      <p className="text-3xl font-bold text-gradient-neon">{asset.count}</p>
                      <p className="text-slate-400 text-sm mt-1">Active Monitors</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 h-32 flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 60, 92, 78].map((height, i) => (
                    <div 
                      key={i}
                      className="flex-1 bg-gradient-to-t from-cyan-500/80 to-cyan-500 rounded-t-sm"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              One Platform, <span className="text-gradient-neon">Infinite Possibilities</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Monitor any type of critical infrastructure with our flexible digital twin technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {assetTypes.map((asset, index) => (
              <div 
                key={index}
                className="group glass-card-hover relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${asset.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 p-8">
                  <div className="text-6xl mb-6">{asset.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{asset.type}</h3>
                  <p className="text-slate-400 mb-6">
                    Advanced structural health monitoring with real-time sensor data and AI-powered predictions
                  </p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${asset.color} text-slate-900 font-semibold`}>
                    <span>{asset.count}</span>
                    <span className="text-sm opacity-75">monitored</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powered by <span className="text-gradient-neon">Advanced Technology</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card-hover p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                  feature.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
                  feature.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                  feature.color === 'pink' ? 'bg-pink-500/10 text-pink-400' :
                  'bg-lime-500/10 text-lime-400'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gradient-neon transition-all">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why StructuraX Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Why <span className="text-gradient-neon">StructuraX</span>?
                </h2>
                <div className="space-y-4">
                  {[
                    'Real-time structural health monitoring',
                    'AI-powered predictive maintenance',
                    'Interactive 3D digital twin models',
                    'Instant alerts and risk notifications',
                    'Cloud-native scalable architecture',
                    'Integration with existing sensors'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <CheckBadgeIcon className="h-4 w-4 text-cyan-400" />
                      </div>
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative glass-card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-slate-400">System Status</span>
                    <span className="badge-lime">Operational</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">API Response</span>
                      <span className="text-cyan-400 font-mono">45ms</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-[45%] bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <span className="text-slate-400">Active Sensors</span>
                      <span className="text-purple-400 font-mono">12,847</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <span className="text-slate-400">Data Points/sec</span>
                      <span className="text-pink-400 font-mono">1.2M</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative glass-card p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Infrastructure Monitoring?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of engineers and facility managers who trust StructuraX for critical infrastructure monitoring
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-neon text-lg px-10 py-4">
                  Start Free Trial
                </Link>
                <Link to="/demo" className="btn-cyber text-lg px-10 py-4">
                  Schedule Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500">
            © 2026 <span className="text-gradient-neon font-semibold">StructuraX</span> — 
            <span className="text-slate-400"> Multi-Asset Digital Twin Platform</span>
          </p>
          <p className="text-slate-600 text-sm mt-2">
            Built with ❤️ for infrastructure intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

