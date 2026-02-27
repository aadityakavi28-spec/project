# Smart Bridge Digital Twin Platform - Production Upgrade

## 🎯 Project Overview

This is a complete production-style web application for Smart Bridge Infrastructure Monitoring with real-time structural health monitoring, predictive maintenance, historical analytics, and alert management.

## ✨ New Features Added

### 1. **Landing Page** (Route: `/`)
- Hero section with platform introduction
- Features showcase
- Call-to-action buttons (Login, Demo Dashboard)
- Professional gradient background
- Fully responsive design

### 2. **Authentication System**
- **Registration Page** (`/register`): Create new accounts with role selection
- **Login Page** (`/login`): Secure JWT-based authentication
- Demo credentials for quick testing
- Password hashing with bcryptjs
- Role-based access control (Admin, Engineer)

### 3. **Protected Dashboard** (Route: `/dashboard`)
- Real-time structural monitoring
- Live sensor data visualization
- Risk assessment metrics
- 3D digital twin visualization
- User info display and logout button
- Responsive design

### 4. **Historical Data Page** (Route: `/history`)
- Select bridge and time range
- Line charts for all metrics:
  - Vibration
  - Load Stress
  - Crack Width
  - Temperature
  - Risk Score
- CSV export functionality
- Statistics and analytics

### 5. **Alert Management System** (Route: `/alerts`)
- Alert history by bridge
- Severity levels (Critical, High, Medium, Low)
- Active/Resolved alert filtering
- Alert details and timestamps
- Summary statistics

### 6. **Multi-Bridge Support**
- Bridge management with metadata
- Admin can create bridges
- Engineers can view bridges
- Bridge-specific data tracking

### 7. **Database Integration**
- MongoDB for persistent data storage
- Mongoose schemas for data validation
- Sensor data persistence
- Alert history tracking

## 🏗️ Architecture

### Frontend Stack
- **React** 18.2.0
- **React Router** v6 for routing
- **Tailwind CSS** 3.3.0 for styling
- **Recharts** 2.10.0 for charts
- **Axios** for API calls
- **Three.js & React Three Fiber** for 3D visualization

### Backend Stack
- **Node.js** & **Express** 4.18.2
- **MongoDB** with **Mongoose** 8.0.0
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📁 Project Structure

```
smart-bridge-digital-twin/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.js      (New)
│   │   │   ├── LoginPage.js        (New)
│   │   │   ├── RegisterPage.js     (New)
│   │   │   ├── Dashboard.js        (Enhanced)
│   │   │   ├── HistoryPage.js      (New)
│   │   │   ├── AlertsPage.js       (New)
│   │   │   └── DemoPage.js         (New)
│   │   ├── components/
│   │   │   ├── Navbar.js           (Enhanced)
│   │   │   ├── PrivateRoute.js     (New)
│   │   │   └── [existing components]
│   │   ├── utils/
│   │   │   ├── api.js              (New - API service layer)
│   │   │   ├── AuthContext.js      (New - Auth state management)
│   │   │   └── [existing utilities]
│   │   ├── App.js                  (Enhanced with routing)
│   │   └── index.js
│   ├── package.json
│   └── .env                         (New)
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js            (Already exists)
│   │   │   ├── Bridge.js          (Already exists)
│   │   │   ├── BridgeData.js      (Already exists)
│   │   │   └── Alert.js           (Already exists)
│   │   ├── routes/
│   │   │   ├── authRoutes.js      (Already exists)
│   │   │   ├── dataRoutes.js      (Already exists)
│   │   │   └── [existing routes]
│   │   ├── controllers/
│   │   │   ├── authController.js  (Already exists)
│   │   │   ├── dataController.js  (Already exists)
│   │   │   └── [existing controllers]
│   │   ├── middleware/
│   │   │   ├── auth.js            (Already exists)
│   │   │   └── [existing middleware]
│   │   ├── seed.js                (New - Database initialization)
│   │   ├── config.js
│   │   └── index.js
│   ├── package.json
│   └── .env                         (New)
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v14+
- **MongoDB** (local or Atlas connection)
- **npm** or **yarn**

### Installation

#### 1. Clone the repository
```bash
cd smart-bridge-digital-twin
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../
npm install
```

#### 4. Setup Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/smart-bridge
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

#### 5. Seed Database (Optional)
```bash
cd backend
npm run seed
```

This creates:
- **Demo Admin**: admin@example.com / admin123456
- **Demo Engineer**: demo@example.com / demo123456
- Sample bridges and sensor data

### Running the Application

#### Start Backend
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```
Backend runs on: `http://localhost:5000`

#### Start Frontend
```bash
npm start
```
Frontend runs on: `http://localhost:3000`

## 📖 User Guide

### For New Users
1. Visit `http://localhost:3000`
2. Click "View Demo Dashboard" for read-only preview
3. Or click "Register" to create an account
4. After login, access:
   - **Dashboard**: Real-time monitoring
   - **History**: View historical data and trends
   - **Alerts**: Check system alerts

### Demo Credentials
- **Admin** (can create bridges):
  - Email: admin@example.com
  - Password: admin123456
- **Engineer** (can view bridges):
  - Email: demo@example.com
  - Password: demo123456

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected API routes
- CORS configuration
- Token expiration (7 days default)
- Protected UI routes with PrivateRoute component

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user (protected)
```

### Bridges
```
GET    /api/bridges                - Get all bridges (protected)
POST   /api/bridges                - Create bridge (admin only)
GET    /api/bridges/:id            - Get bridge details (protected)
```

### Sensor Data
```
POST   /api/sensor-data            - Add sensor data
GET    /api/sensor-data/:bridgeId/latest     - Get latest data (protected)
GET    /api/sensor-data/:bridgeId/history    - Get historical data (protected)
```

### Alerts
```
GET    /api/alerts/:bridgeId       - Get alerts for bridge (protected)
```

## 🎨 UI/UX Enhancements

- Modern gradient backgrounds
- Smooth transitions and animations
- Responsive design (mobile, tablet, desktop)
- Dark theme with blue accents
- Real-time status indicators
- Interactive charts using Recharts
- 3D visualization with Three.js

## 📈 Key Metrics Tracked

1. **Vibration** (m/s²) - Structural vibration levels
2. **Load Stress** (%) - Load distribution across structure
3. **Crack Width** (mm) - Surface crack measurements
4. **Temperature** (°C) - Environmental temperature
5. **Risk Score** - AI-calculated structural risk (0-100)

## 🚨 Alert System

Alerts are automatically generated when:
- Risk Score > 75
- Vibration exceeds threshold
- Cracks exceed size limit
- Load stress is critical

Alerts include:
- Severity level (Critical, High, Medium, Low)
- Timestamp
- Resolution status
- Historical tracking

## 🧪 Testing Workflow

1. **Register/Login**
   - Create account with engineer role
   - Login with demo credentials
   - Test logout functionality

2. **View Monitoring Data**
   - Check real-time metrics on dashboard
   - View 3D bridge model
   - Check maintenance recommendations

3. **Historical Analysis**
   - Select bridge from dropdown
   - Choose time range (1hr to 30 days)
   - View charts and statistics
   - Download CSV report

4. **Alert Management**
   - Check active alerts
   - View resolved alerts
   - Filter by severity
   - View alert details

## 🔄 Data Flow

```
1. Sensors → Backend API (/api/sensor-data)
2. Backend stores data → MongoDB
3. Frontend fetches data → API endpoints
4. Charts & UI display → User visualization
5. Alerts triggered → Risk > 75
6. Historical data → TimeRange queries
```

## 📝 Database Schema

### User
```
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'engineer',
  createdAt: Date,
  updatedAt: Date
}
```

### Bridge
```
{
  name: String,
  location: String,
  status: 'operational' | 'maintenance' | 'alert',
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### BridgeData
```
{
  bridgeId: ObjectId (ref: Bridge),
  vibration: Number,
  load: Number,
  crack: Number,
  temperature: Number,
  riskScore: Number,
  timestamp: Date
}
```

### Alert
```
{
  bridgeId: ObjectId (ref: Bridge),
  type: String,
  severity: 'low' | 'medium' | 'high' | 'critical',
  message: String,
  value: Number,
  riskScore: Number,
  resolved: Boolean,
  resolvedAt: Date,
  createdAt: Date
}
```

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection
- Verify port 5000 is available
- Check .env file for MONGODB_URI

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Clear browser cache and restart frontend

### Login issues
- Run `npm run seed` to create demo users
- Check MongoDB for User collection
- Verify JWT_SECRET in backend .env

### Historical data is empty
- Run `npm run seed` to populate sample data
- Check MongoDB BridgeData collection
- Ensure bridge ID is selected

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

## 🤝 Contributing

To add new features:
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Submit for review

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Development Team

Smart Bridge Digital Twin Platform v2.0
- Built with React, Node.js, and MongoDB
- Focused on infrastructure monitoring and predictive maintenance

---

**Last Updated**: February 27, 2026
**Version**: 2.0.0
