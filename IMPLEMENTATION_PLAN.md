# Multi-Asset Structural Monitoring Platform - Implementation Plan

## Information Gathered:

### Current System Analysis:
- **src/App.js**: React Router with authentication-protected routes
- **src/pages/Dashboard.js**: Bridge-specific monitoring with live data APIs
- **src/components/BridgeModel.js**: 3D bridge visualization (PRESERVE - NO CHANGES)
- **src/components/SensorCard.js**: Reusable sensor display component
- **src/components/RiskMeter.js**: Risk assessment visualization
- **src/utils/AuthContext.js**: Authentication with mock/API fallback

### Architecture Decision:
The system will transition from "Bridge-specific" to "Asset-type-driven" while keeping the Bridge model completely untouched.

---

## Implementation Plan:

### Phase 1: Core Infrastructure (Asset Type System)
- [ ] Create `src/utils/assetTypes.js` - Asset type definitions and sensor schemas
- [ ] Create `src/utils/simulationEngine.js` - Deterministic simulation logic
- [ ] Create `src/context/AssetContext.js` - Asset state management

### Phase 2: New Pages
- [ ] Create `src/pages/AssetCommandCenter.js` - Asset type selection screen
- [ ] Create `src/pages/AssetList.js` - Asset list by type
- [ ] Create `src/pages/UnifiedDashboard.js` - Adaptive monitoring dashboard

### Phase 3: 3D Models (Building & Tunnel)
- [ ] Create `src/components/BuildingModel.js` - 3D building visualization
- [ ] Create `src/components/TunnelModel.js` - 3D tunnel visualization

### Phase 4: Integration
- [ ] Update `src/App.js` - Add new routes
- [ ] Update `src/components/Navbar.js` - Add asset context navigation
- [ ] Refactor `src/pages/Dashboard.js` into reusable components

### Phase 5: Sensor Standardization
- [ ] Implement deterministic sensor value generation
- [ ] Define sensor ranges per asset type
- [ ] Implement gradual degradation logic

---

## Asset Type Definitions:

### Bridge (Existing - Preserve Model)
- Sensors: Vibration, Load, Crack Width, Temperature
- Risk Formula: (V × 0.4) + (C × 0.3) + (L × 0.3)

### Building (New)
- Sensors: Tilt, Displacement, Crack Width, Vibration
- Risk Formula: (T × 0.3) + (D × 0.3) + (C × 0.2) + (V × 0.2)

### Tunnel (New)
- Sensors: Water Pressure, Humidity, Crack Width, Structural Strain
- Risk Formula: (WP × 0.3) + (H × 0.2) + (C × 0.25) + (SS × 0.25)

---

## Color System (Consistent):
- 🟢 Green: Healthy (0-25 risk)
- 🟡 Yellow: Monitoring (26-50 risk)
- 🟠 Orange: Warning (51-75 risk)
- 🔴 Red: Critical (76-100 risk)

---

## Simulation Engine Rules:
1. All values must stay within engineering-safe operational ranges
2. No random number generation without bounded logic (±3% max fluctuation)
3. Gradual degradation over time
4. No sudden unrealistic jumps
5. Trend-based evolution
