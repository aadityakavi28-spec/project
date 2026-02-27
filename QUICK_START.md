# Quick Start Guide - Smart Bridge Digital Twin Platform

## 🚀 5-Minute Setup

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Configure Environment

**Backend** - Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/smart-bridge
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend** - Create `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Step 3: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running locally
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Update MONGODB_URI in backend/.env

### Step 4: Seed Database (Optional but Recommended)

```bash
cd backend
npm run seed
```

This creates:
- Demo Admin: admin@example.com / admin123456
- Demo Engineer: demo@example.com / demo123456
- Sample bridges and data

### Step 5: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm start
# Runs on http://localhost:3000
```

## 🎯 First Steps

1. **Open** http://localhost:3000
2. **Click** "View Demo Dashboard" to see the platform in action
3. **Or** click "Register" to create a new account
4. **Or** click "Login" and use: demo@example.com / demo123456

## 📱 Key Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Landing page | ❌ No |
| `/demo` | Demo dashboard | ❌ No |
| `/login` | Login page | ❌ No |
| `/register` | Registration | ❌ No |
| `/dashboard` | Real-time monitoring | ✅ Yes |
| `/history` | Historical data & charts | ✅ Yes |
| `/alerts` | Alert management | ✅ Yes |

## 🧪 Quick Test Workflow

### 1. View Demo
```
http://localhost:3000 → "View Demo Dashboard"
```
See real-time monitoring without logging in.

### 2. Register New Account
```
http://localhost:3000 → "Register"
Fill form → Create account → Auto login to dashboard
```

### 3. Use Demo Credentials
```
http://localhost:3000 → "Login"
Email: demo@example.com
Password: demo123456
```

### 4. Explore Features
- **Dashboard**: Real-time data and 3D visualization
- **History**: Charts with time-range selection and CSV export
- **Alerts**: View active and resolved alerts

## 📊 Live Data

Once logged in:
- Dashboard updates every 2 seconds with simulated sensor data
- Risk score recalculates in real-time
- Historical data is automatically stored in MongoDB

## 🔧 Development Commands

```bash
# Frontend
npm start              # Start dev server (port 3000)
npm build             # Build for production
npm test              # Run tests
npm eject             # Eject from create-react-app (irreversible)

# Backend
npm start             # Start server (port 5000)
npm run dev           # Start with auto-reload
npm run seed          # Seed database with demo data
```

## 🐛 Common Issues & Fixes

### "Cannot connect to backend"
```bash
# Check if backend is running
curl http://localhost:5000

# If not, restart backend:
cd backend && npm start
```

### "MongoDB connection error"
```bash
# Make sure MongoDB is running:
mongod

# Or check connection string in backend/.env
```

### "Demo credentials not working"
```bash
# Reseed the database:
cd backend
npm run seed
```

### "CSS not loading (Tailwind)"
```bash
# Rebuild Tailwind:
npm run build
```

## 📈 Next Steps

1. **Create a bridge** (as admin)
   - Go to Dashboard
   - Create a new bridge entry

2. **Monitor in real-time**
   - Watch metrics update
   - Check alerts as risk increases

3. **Analyze history**
   - Go to History page
   - Select time range
   - Download CSV report

4. **Manage infrastructure**
   - Monitor multiple bridges
   - Track maintenance tasks
   - Get predictive insights

## 📚 Documentation

- Full docs: See `PRODUCTION_UPGRADE.md`
- API Reference: See `backend/QUICKSTART.md`
- Architecture: See project structure in docs

## 🆘 Need Help?

1. Check error console: Open DevTools (F12)
2. Check backend logs: Look at terminal running backend
3. Verify MongoDB: Check MongoDB Atlas or local connection
4. Review documentation: See markdown files in project root

## ✅ Success Checklist

- [ ] Dependencies installed (npm install)
- [ ] Environment files created (.env files)
- [ ] MongoDB running or connected
- [ ] Backend started (port 5000)
- [ ] Frontend started (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can see landing page
- [ ] Can view demo dashboard
- [ ] Can login with demo@example.com
- [ ] Can see real-time data
- [ ] Can download historical CSVs

## 🎉 You're All Set!

Enjoy the Smart Bridge Digital Twin Platform!

---

**Need to restart?** Use these commands:

```bash
# Kill all node processes (Windows)
taskkill /F /IM node.exe

# Kill all node processes (Mac/Linux)
pkill -f node

# Then restart with:
# Terminal 1: cd backend && npm start
# Terminal 2: npm start
```

---
Version: 2.0.0 | Last Updated: February 27, 2026
