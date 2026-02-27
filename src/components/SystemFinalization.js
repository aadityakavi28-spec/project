import React, { useState } from 'react';
import './SystemFinalization.css';

const SystemFinalization = () => {
  const [isActivating, setIsActivating] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleActivate = () => {
    setIsActivating(true);
    // Simulate system initialization
    setTimeout(() => {
      setIsActivating(false);
      setIsActive(true);
      setShowSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2500);
  };

  const handleSystemCheck = () => {
    alert('Running final system diagnostics...\n✓ All sensors responsive\n✓ AI model loaded\n✓ Database connection active\n✓ Alert protocols enabled');
  };

  return (
    <div className="finalization-container">
      {/* Background gradient */}
      <div className="finalization-bg"></div>

      {/* Main content */}
      <div className="finalization-content">
        {/* Header */}
        <div className="finalization-header">
          <h1 className="finalization-title">Finalize Monitoring Setup</h1>
          <p className="finalization-subtitle">Review your bridge configuration and activate AI monitoring</p>
        </div>

        {/* Two-column layout */}
        <div className="finalization-grid">
          {/* LEFT SIDE - System Summary Card */}
          <div className="summary-card">
            <div className="card-header">
              <h2 className="card-title">System Summary</h2>
            </div>

            {/* Bridge Information */}
            <div className="info-section">
              <h3 className="section-label">Bridge Information</h3>
              <div className="info-item">
                <span className="info-label">Bridge ID:</span>
                <span className="info-value">BRG-2045-AI</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location:</span>
                <span className="info-value">Mumbai Coastal Highway</span>
              </div>
              <div className="info-item">
                <span className="info-label">Bridge Type:</span>
                <span className="info-value">Suspension</span>
              </div>
              <div className="info-item">
                <span className="info-label">Monitoring Mode:</span>
                <span className="info-value">Real-Time + AI Prediction</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sensor Package:</span>
                <span className="info-value">Advanced (Vibration + Load + Stress + Temp)</span>
              </div>
            </div>

            {/* System Status Indicators */}
            <div className="status-section">
              <h3 className="section-label">System Status</h3>
              
              <div className="status-item">
                <div className="status-dot green pulse"></div>
                <span className="status-text">Sensors Connected</span>
              </div>

              <div className="status-item">
                <div className="status-dot green pulse"></div>
                <span className="status-text">AI Engine Ready</span>
              </div>

              <div className="status-item">
                <div className="status-dot yellow pulse"></div>
                <span className="status-text">Historical Data Syncing</span>
              </div>

              <div className="status-item">
                <div className={`status-dot ${isActive ? 'green' : 'green'} ${isActive ? 'pulse' : ''}`}></div>
                <span className="status-text">
                  {isActive ? '✓ Monitoring Active' : 'Alert System Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Activation Panel Card */}
          <div className="activation-card">
            <div className="card-header">
              <h2 className="card-title">Activation Panel</h2>
            </div>

            {/* Metrics */}
            <div className="metrics-section">
              <div className="metric-item">
                <div className="metric-label">Monitoring Coverage</div>
                <div className="metric-value">98%</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '98%' }}></div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-label">AI Confidence Level</div>
                <div className="metric-value">94%</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-label">Risk Prediction Model</div>
                <div className="metric-value">
                  <span className="badge-enabled">Enabled</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button
                className={`btn btn-primary ${isActivating ? 'loading' : ''} ${isActive ? 'active' : ''}`}
                onClick={handleActivate}
                disabled={isActivating || isActive}
              >
                {isActivating && <span className="spinner"></span>}
                {isActivating ? 'System Initializing...' : isActive ? '✓ Monitoring Active' : 'Activate Monitoring System'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleSystemCheck}
                disabled={isActivating}
              >
                Run Final System Check
              </button>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <div className="success-text">Bridge Monitoring Successfully Activated</div>
              </div>
            )}

            {isActive && (
              <div className="action-buttons">
                <button className="action-btn">View Live Dashboard</button>
                <button className="action-btn">Download System Report</button>
                <button className="action-btn">Configure Alert Threshold</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemFinalization;
