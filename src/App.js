import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { AssetProvider } from './context/AssetContext';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import DemoPage from './pages/DemoPage';
import HistoryPage from './pages/HistoryPage';
import AlertsPage from './pages/AlertsPage';
import FinalizationPage from './pages/FinalizationPage';
import UserProfile from './pages/UserProfile';
import AdminPage from './pages/AdminPage';

// Multi-Asset Platform Pages
import AssetCommandCenter from './pages/AssetCommandCenter';
import AssetList from './pages/AssetList';
import UnifiedDashboard from './pages/UnifiedDashboard';
import AssetGenerator from './pages/AssetGenerator';

function App() {
  return (
    <AuthProvider>
      <AssetProvider>
        <Router>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/finalization" element={<FinalizationPage />} />

            {/* Protected Pages */}
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/admin" element={<PrivateRoute component={AdminPage} adminOnly={true} />} />
            <Route path="/profile" element={<PrivateRoute component={UserProfile} />} />
            <Route path="/history" element={<PrivateRoute component={HistoryPage} />} />
            <Route path="/alerts" element={<PrivateRoute component={AlertsPage} />} />

            {/* Multi-Asset Platform Routes */}
            <Route path="/command-center" element={<PrivateRoute component={AssetCommandCenter} />} />
            <Route path="/asset-list" element={<PrivateRoute component={AssetList} />} />
            <Route path="/unified-dashboard" element={<PrivateRoute component={UnifiedDashboard} />} />
            <Route path="/generate-asset" element={<PrivateRoute component={AssetGenerator} adminOnly={true} />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AssetProvider>
    </AuthProvider>
  );
}

export default App;
