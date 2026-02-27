# Smart Bridge Digital Twin - Setup & Deployment Checklist

## ✅ Pre-Setup Requirements

- [ ] Node.js v14+ installed (`node -v`)
- [ ] npm or yarn installed (`npm -v`)
- [ ] MongoDB server ready (local or Atlas)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command prompt ready

## 📦 Installation Checklist

### Step 1: Frontend Setup
- [ ] Navigate to project root: `cd ~/Desktop/project`
- [ ] Install frontend dependencies: `npm install`
- [ ] Check for errors: Should complete without errors
- [ ] Verify packages: `npm list react react-router-dom axios`

### Step 2: Backend Setup
- [ ] Navigate to backend: `cd backend`
- [ ] Install backend dependencies: `npm install`
- [ ] Check for errors: Should complete without errors
- [ ] Verify packages: `npm list express mongoose jwt`
- [ ] Return to root: `cd ..`

## 🔧 Configuration Checklist

### Frontend Configuration (.env)
- [ ] Create file: `touch .env` (or use editor)
- [ ] Add: `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] Add: `REACT_APP_ENV=development`
- [ ] Save file
- [ ] Verify file exists: `ls .env`

### Backend Configuration (backend/.env)
- [ ] Navigate: `cd backend`
- [ ] Create file: `touch .env`
- [ ] Add: `MONGODB_URI=mongodb://localhost:27017/smart-bridge`
- [ ] Add: `JWT_SECRET=your-secret-key-change-this`
- [ ] Add: `JWT_EXPIRE=7d`
- [ ] Add: `PORT=5000`
- [ ] Add: `NODE_ENV=development`
- [ ] Add: `CORS_ORIGIN=http://localhost:3000`
- [ ] Save file
- [ ] Verify file exists: `ls .env`
- [ ] Return to root: `cd ..`

## 🗄️ Database Setup Checklist

### Option A: Local MongoDB
- [ ] MongoDB installed locally
- [ ] MongoDB service running: `mongod`
- [ ] Can connect: `mongo` or `mongosh`
- [ ] Database exists or will be created automatically

### Option B: MongoDB Atlas (Cloud)
- [ ] Atlas account created (mongodb.com/cloud/atlas)
- [ ] Cluster created
- [ ] Connection string obtained
- [ ] Connection string added to `backend/.env` as `MONGODB_URI`
- [ ] IP whitelist configured (allow all for development)
- [ ] Username/password created for database

## 📊 Initialize Database Checklist

- [ ] Backend directory: `cd backend`
- [ ] Seed database: `npm run seed`
- [ ] Check output: Should see ✅ messages
- [ ] Demo users created (admin@, demo@)
- [ ] Sample bridges created
- [ ] Sample data populated
- [ ] Return to root: `cd ..`

## 🚀 Launch Checklist

### Terminal 1: Backend
- [ ] Navigate to backend: `cd backend`
- [ ] Start server: `npm start`
- [ ] Check port: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
- [ ] Verify message: "Server running on http://localhost:5000"
- [ ] Keep terminal open

### Terminal 2: Frontend
- [ ] Open new terminal
- [ ] Navigate to root: `cd ~/Desktop/project`
- [ ] Start frontend: `npm start`
- [ ] Browser opens automatically to http://localhost:3000
- [ ] Page loads: Landing page visible
- [ ] Keep terminal open

## 🧪 Functionality Verification Checklist

### Landing Page (http://localhost:3000)
- [ ] Page loads without errors
- [ ] Hero section visible
- [ ] Feature cards display (4 features)
- [ ] "View Demo Dashboard" button clickable
- [ ] "Login" button clickable
- [ ] "Register" button clickable
- [ ] Professional design (gradient background)

### Demo Dashboard (/demo)
- [ ] Page loads without login
- [ ] Navbar shows demo header
- [ ] Sensor cards display (Vibration, Load, Crack, Temp)
- [ ] Risk meter shows real-time calculation
- [ ] Charts update with data
- [ ] 3D bridge model visible
- [ ] Data updates every 2 seconds

### Registration (/register)
- [ ] Form fields visible (name, email, password, role)
- [ ] Can enter valid data
- [ ] Submit button clickable
- [ ] Success: Redirected to dashboard
- [ ] Error handling: Shows error for invalid data
- [ ] Link to login page works

### Login (/login)
- [ ] Form fields visible (email, password)
- [ ] Can enter credentials
- [ ] "Use Demo Credentials" button works
- [ ] Submit button clickable
- [ ] Success: Redirected to dashboard
- [ ] Token stored in localStorage
- [ ] Error handling: Shows error for invalid credentials

### Protected Dashboard (/dashboard)
- [ ] Can only access when logged in
- [ ] Navbar displays user name
- [ ] User dropdown shows email and role
- [ ] Logout button works (redirects to home)
- [ ] Navigation links visible (Dashboard, History, Alerts)
- [ ] All monitoring data displays
- [ ] Real-time updates continue
- [ ] High-risk alert banner appears when risk > 75

### History Page (/history)
- [ ] Can access when logged in
- [ ] Bridge selector dropdown populated
- [ ] Time range selector shows all options
- [ ] Charts load with data
- [ ] All 5 charts visible (Vibration, Load, Crack, Temp, Risk)
- [ ] Statistics display (Total records, averages, max)
- [ ] CSV download button works
- [ ] CSV file contains correct data

### Alerts Page (/alerts)
- [ ] Can access when logged in
- [ ] Bridge selector dropdown populated
- [ ] Alert list displays
- [ ] Severity colors correct (red, orange, etc)
- [ ] Filter for resolved alerts works
- [ ] Refresh button works
- [ ] Statistics display correctly

### Navbar Components
- [ ] Logo clickable (goes to dashboard)
- [ ] Nav links highlight current page
- [ ] User menu dropdown works
- [ ] Logout function works properly
- [ ] Mobile responsive (hamburger on small screens)

## 🔐 Security Verification Checklist

### Authentication
- [ ] Register creates new user
- [ ] Login stores JWT token
- [ ] Token displayed in localStorage
- [ ] Protected pages redirect to login without token
- [ ] Logout clears token and user data
- [ ] Token sent in Authorization header
- [ ] Invalid tokens rejected

### Authorization
- [ ] Engineers can view bridges
- [ ] Only admins can create bridges
- [ ] Role field stored in user object
- [ ] Different permissions based on role

## 📊 Data Persistence Checklist

### MongoDB Data Storage
- [ ] User created in MongoDB
- [ ] Bridge data stored in database
- [ ] Sensor data saved when added
- [ ] Historical data queryable by time range
- [ ] Alerts created when risk > 75
- [ ] Alert history maintained

### API Endpoints
- [ ] POST /api/auth/register works
- [ ] POST /api/auth/login works
- [ ] GET /api/bridges works
- [ ] POST /api/bridges works (admin)
- [ ] GET /api/sensor-data/:id/latest works
- [ ] GET /api/sensor-data/:id/history works
- [ ] POST /api/sensor-data works
- [ ] GET /api/alerts/:id works

## 🎨 UI/UX Verification Checklist

### Design & Responsiveness
- [ ] Mobile view works (< 640px)
- [ ] Tablet view works (640px - 1024px)
- [ ] Desktop view works (> 1024px)
- [ ] Colors consistent (gradient, blue, slate)
- [ ] Fonts readable and sized appropriately
- [ ] Spacing and padding consistent
- [ ] Buttons have hover effects
- [ ] Forms have proper labels

### Loading States
- [ ] Loading spinners appear during API calls
- [ ] "Loading..." text displays
- [ ] Buttons disabled during submission
- [ ] User can't double-submit

### Error Handling
- [ ] Error messages display for API failures
- [ ] Form validation shows errors
- [ ] User-friendly error text
- [ ] Errors disappear on successful operation

## 📝 Documentation Verification Checklist

- [ ] README.md exists
- [ ] QUICK_START.md exists
- [ ] PRODUCTION_UPGRADE.md exists
- [ ] IMPLEMENTATION_SUMMARY.md exists
- [ ] API_TESTING_GUIDE.md exists
- [ ] .env.example files provided (optional)
- [ ] All documentation is clear and complete

## 🧹 Code Quality Checklist

- [ ] No console errors in browser
- [ ] No console warnings (minor is ok)
- [ ] Backend logs show requests
- [ ] No unused variables in main components
- [ ] Imports are organized
- [ ] File structure is logical
- [ ] Component names are descriptive

## 🚨 Common Issues & Fixes

### MongoDB Connection Fails
- [ ] Is MongoDB running?
- [ ] Check connection string in .env
- [ ] Verify database permissions
- [ ] Check firewall/network settings

### "Port 5000 already in use"
- [ ] Find process: `lsof -i :5000`
- [ ] Kill process: `kill -9 <PID>`
- [ ] Or change PORT in backend/.env

### "Cannot find module"
- [ ] Run `npm install` in appropriate directory
- [ ] Check node_modules exists
- [ ] Clear node cache: `npm cache clean --force`

### Frontend can't reach backend
- [ ] Backend running on port 5000?
- [ ] REACT_APP_API_URL correct in .env?
- [ ] Check CORS_ORIGIN in backend/.env

### "Token expired" errors
- [ ] Log out and log back in
- [ ] Clear localStorage and retry
- [ ] Check JWT_EXPIRE setting

## 📈 Performance Verification Checklist

### Loading Times
- [ ] Landing page loads < 2s
- [ ] Dashboard loads < 3s
- [ ] Charts render < 2s
- [ ] API responses < 500ms
- [ ] No UI freezing

### Real-time Updates
- [ ] Dashboard updates every 2 seconds
- [ ] Charts smoothly animate
- [ ] No memory leaks
- [ ] Browser dev tools show reasonable memory

## 🎯 Final Testing Workflow

1. [ ] Complete landing page tour
2. [ ] Create new account via register
3. [ ] Log out and log back in with new account
4. [ ] Login with demo@example.com
5. [ ] Navigate all pages (Dashboard, History, Alerts)
6. [ ] Test CSV export on History page
7. [ ] Verify data persists (refresh page)
8. [ ] Check browser console for errors
9. [ ] Check MongoDB for stored data
10. [ ] Test logout functionality

## 🚀 Deployment Preparation Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] JWT_SECRET changed from default
- [ ] NODE_ENV set to production
- [ ] CORS_ORIGIN updated for production domain
- [ ] Frontend build verified (npm run build)
- [ ] Backend dependencies up to date
- [ ] Documentation reviewed
- [ ] Error logs configured
- [ ] Monitoring setup ready

## 📋 Project Completion Checklist

- [ ] All 8 parts implemented
- [ ] Frontend fully functional
- [ ] Backend APIs working
- [ ] Database integrated
- [ ] Authentication working
- [ ] Authorization working
- [ ] All pages created
- [ ] Existing dashboard preserved
- [ ] Documentation complete
- [ ] Code quality verified
- [ ] Testing passed
- [ ] Ready for production

## 🎉 Success Message

If all checkboxes are marked, your Smart Bridge Digital Twin Platform v2.0 is fully implemented and ready to use!

---

## 📞 Support Resources

- **Quick Questions:** Check API_TESTING_GUIDE.md
- **Setup Issues:** Review QUICK_START.md
- **Full Documentation:** See PRODUCTION_UPGRADE.md
- **Implementation Details:** Check IMPLEMENTATION_SUMMARY.md
- **Console Errors:** Check browser DevTools (F12)
- **API Issues:** Test with cURL or Postman

---

**Version:** 2.0.0  
**Last Updated:** February 27, 2026  
**Status:** ✅ Complete
