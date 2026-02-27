# 🌍 Weather API Setup Guide

## Quick Fix - Get Your FREE OpenWeather API Key

### Step 1: Sign Up for FREE
1. Go to: https://openweathermap.org/api
2. Click **"Sign Up"** button (top right)
3. Create FREE account (no credit card needed!)
4. Verify email

### Step 2: Get Your API Key
1. Log in to your account
2. Go to **API Keys** tab
3. You'll see your default API key (32 characters)
4. Copy the entire key

### Step 3: Add to Your Project
1. Open `.env.local` file in project root
2. Replace this line:
   ```
   REACT_APP_WEATHER_KEY=demo_key_here
   ```
   With your actual key:
   ```
   REACT_APP_WEATHER_KEY=your_copied_key_here_32_characters
   ```
3. Save the file

### Step 4: Restart Server
```bash
npm start
```

---

## ✅ How to Know It's Working

After restart, check Dashboard:
- **API Role Panel** shows: 🟢 **LIVE ✓** for Weather API
- **Live Data Indicator** shows: 🌍 **LIVE** (green dot)
- **Temperature sensor** shows real temperature for London
- **Windspeed** affects vibration reading in real-time

---

## 🐛 If Still Showing Offline

### Check 1: API Key Format
- Should be exactly 32 characters
- No spaces before/after
- No quotes around it

### Check 2: Restart After Save
- Kill terminal: `Ctrl+C`
- Run again: `npm start`
- Wait 5-10 seconds for app to load

### Check 3: Check Browser Console
- Open DevTools: `F12`
- Go to **Console** tab
- Look for messages like:
  - ✅ `"✅ Weather API Success - Temp: 15.2°C Wind: 5.1 m/s"` = Working!
  - ❌ `"❌ Weather API Error: 401 Unauthorized"` = Invalid key
  - ❌ `"❌ Weather API Error: 404 Not Found"` = City not found

### Check 4: Test Your Key
Use this URL in browser (replace KEY with your actual key):
```
https://api.openweathermap.org/data/2.5/weather?q=London,GB&appid=YOUR_KEY_HERE&units=metric
```

If it returns JSON with `main.temp` and `wind.speed`, your key works! ✅

---

## 📊 What Happens With Valid Key

| Component | Status |
|-----------|--------|
| API Panel | Shows 🟢 LIVE ✓ |
| Live Data Indicator | Shows green LIVE indicator |
| Countdown Timer | Updates every 10 seconds |
| Temperature Sensor | Shows real London temperature |
| Vibration | Affected by real wind speed (×4) |
| Weather Icon | Shows actual current weather |

---

## 🚨 What Happens Without Valid Key

| Component | Status |
|-----------|--------|
| API Panel | Shows ❌ OFFLINE |
| Live Data Indicator | Shows ⚙️ BACKUP (yellow) |
| Temperature Sensor | Shows simulated random values |
| Vibration | Shows simulated random values |
| Console Error | Shows 401/404/timeout error |

---

## FREE API Limitations (You Get)

- ✅ Current weather for any city
- ✅ 60 calls per minute
- ✅ Unlimited calls per month
- ✅ No credit card required
- ❌ No 5-day forecast (premium only)
- ❌ No historical data (premium only)

**Our app only needs current weather, so FREE tier is perfect!** 🎯

---

## Need Help?

**API Key doesn't work?**
1. Check it's 32 characters exactly
2. Re-copy from your OpenWeatherAPI.org account
3. Make sure `.env.local` file is saved
4. Restart npm start
5. Check browser console (F12)

**City not found?**
- Change in `.env.local`:
  ```
  REACT_APP_WEATHER_CITY=Paris
  REACT_APP_WEATHER_COUNTRY_CODE=FR
  ```

**Still offline?**
- API might be checking your IP origin (CORS)
- This is normal during local development
- Will only show LIVE when deployed to actual domain
- Fallback to simulation works fine locally
