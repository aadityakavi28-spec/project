# Smart Bridge API Testing Guide

## 🔌 API Endpoints Reference

All endpoints are available at: `http://localhost:5000/api`

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "engineer"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "engineer"
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "demo123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Demo Engineer",
    "email": "demo@example.com",
    "role": "engineer"
  }
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Demo Engineer",
    "email": "demo@example.com",
    "role": "engineer"
  }
}
```

### Bridge Endpoints

#### 4. Get All Bridges
```http
GET /api/bridges
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Golden Gate Bridge",
      "location": "San Francisco, CA",
      "status": "operational",
      "createdBy": "507f1f77bcf86cd799439010",
      "createdAt": "2026-02-27T10:00:00.000Z"
    }
  ]
}
```

#### 5. Create Bridge (Admin Only)
```http
POST /api/bridges
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New Bridge",
  "location": "City, Country"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "New Bridge",
    "location": "City, Country",
    "status": "operational",
    "createdBy": "507f1f77bcf86cd799439010",
    "createdAt": "2026-02-27T10:00:00.000Z"
  }
}
```

#### 6. Get Bridge Details
```http
GET /api/bridges/{bridgeId}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Golden Gate Bridge",
    "location": "San Francisco, CA",
    "status": "operational",
    "createdBy": "507f1f77bcf86cd799439010",
    "createdAt": "2026-02-27T10:00:00.000Z"
  }
}
```

### Sensor Data Endpoints

#### 7. Add Sensor Data
```http
POST /api/sensor-data
Content-Type: application/json

{
  "bridgeId": "507f1f77bcf86cd799439011",
  "vibration": 25.5,
  "load": 45.2,
  "crack": 2.1,
  "temperature": 22.5,
  "riskScore": 35.8
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "bridgeId": "507f1f77bcf86cd799439011",
    "vibration": 25.5,
    "load": 45.2,
    "crack": 2.1,
    "temperature": 22.5,
    "riskScore": 35.8,
    "timestamp": "2026-02-27T10:00:00.000Z"
  }
}
```

#### 8. Get Latest Sensor Data
```http
GET /api/sensor-data/{bridgeId}/latest
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "bridgeId": "507f1f77bcf86cd799439011",
    "vibration": 25.5,
    "load": 45.2,
    "crack": 2.1,
    "temperature": 22.5,
    "riskScore": 35.8,
    "timestamp": "2026-02-27T10:00:00.000Z"
  }
}
```

#### 9. Get Historical Data
```http
GET /api/sensor-data/{bridgeId}/history?hours=24&limit=100
Authorization: Bearer {token}
```

**Query Parameters:**
- `hours`: Number of hours to look back (default: 24)
- `limit`: Maximum records to return (default: 100)

**Response (200):**
```json
{
  "success": true,
  "count": 24,
  "data": [
    {
      "_id": "607f1f77bcf86cd799439001",
      "bridgeId": "507f1f77bcf86cd799439011",
      "vibration": 25.5,
      "load": 45.2,
      "crack": 2.1,
      "temperature": 22.5,
      "riskScore": 35.8,
      "timestamp": "2026-02-27T00:00:00.000Z"
    }
  ]
}
```

### Alert Endpoints

#### 10. Get Alerts
```http
GET /api/alerts/{bridgeId}?resolved=false
Authorization: Bearer {token}
```

**Query Parameters:**
- `resolved`: Filter by resolved status (true/false, optional)

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "707f1f77bcf86cd799439011",
      "bridgeId": "507f1f77bcf86cd799439011",
      "type": "risk",
      "severity": "high",
      "message": "High risk score detected: 78.5",
      "value": 78.5,
      "riskScore": 78.5,
      "resolved": false,
      "resolvedAt": null,
      "createdAt": "2026-02-27T10:00:00.000Z"
    }
  ]
}
```

## 🧪 Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123456"}'
```

### Save Token
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123456"}' \
  | jq -r '.token')

echo $TOKEN
```

### Use Token in Request
```bash
curl -X GET http://localhost:5000/api/bridges \
  -H "Authorization: Bearer $TOKEN"
```

### Add Sensor Data
```bash
curl -X POST http://localhost:5000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "bridgeId":"507f1f77bcf86cd799439011",
    "vibration":30,
    "load":50,
    "crack":2,
    "temperature":23,
    "riskScore":40
  }'
```

## 📊 Testing with Postman

### 1. Create Environment
- Set variable `baseUrl` = `http://localhost:5000`
- Set variable `token` = (will be set after login)
- Set variable `bridgeId` = (will be set after creating bridge)

### 2. Login Request
- **Method:** POST
- **URL:** `{{baseUrl}}/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "demo@example.com",
  "password": "demo123456"
}
```
- **Tests:** Add script to set token
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

### 3. Get Bridges
- **Method:** GET
- **URL:** `{{baseUrl}}/api/bridges`
- **Headers:**
  - Authorization: Bearer {{token}}
- **Tests:** Set bridgeId
```javascript
var jsonData = pm.response.json();
if (jsonData.data && jsonData.data.length > 0) {
  pm.environment.set("bridgeId", jsonData.data[0]._id);
}
```

### 4. Add Sensor Data
- **Method:** POST
- **URL:** `{{baseUrl}}/api/sensor-data`
- **Body (JSON):**
```json
{
  "bridgeId": "{{bridgeId}}",
  "vibration": 25.5,
  "load": 45.2,
  "crack": 2.1,
  "temperature": 22.5,
  "riskScore": 35.8
}
```

### 5. Get Latest Data
- **Method:** GET
- **URL:** `{{baseUrl}}/api/sensor-data/{{bridgeId}}/latest`
- **Headers:**
  - Authorization: Bearer {{token}}

### 6. Get Historical Data
- **Method:** GET
- **URL:** `{{baseUrl}}/api/sensor-data/{{bridgeId}}/history?hours=24`
- **Headers:**
  - Authorization: Bearer {{token}}

### 7. Get Alerts
- **Method:** GET
- **URL:** `{{baseUrl}}/api/alerts/{{bridgeId}}`
- **Headers:**
  - Authorization: Bearer {{token}}

## 🔍 Common Testing Scenarios

### Scenario 1: Complete Registration & Login Flow
```bash
# 1. Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"test123456",
    "role":"engineer"
  }'

# 2. Login with new user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"test123456"
  }'

# 3. Use returned token for authenticated requests
```

### Scenario 2: View Bridge Data Timeline
```bash
# 1. Get all bridges
curl -X GET http://localhost:5000/api/bridges \
  -H "Authorization: Bearer $TOKEN"

# 2. Get latest data for a bridge
curl -X GET "http://localhost:5000/api/sensor-data/{bridgeId}/latest" \
  -H "Authorization: Bearer $TOKEN"

# 3. Get 24-hour historical data
curl -X GET "http://localhost:5000/api/sensor-data/{bridgeId}/history?hours=24" \
  -H "Authorization: Bearer $TOKEN"

# 4. Get alerts for the bridge
curl -X GET "http://localhost:5000/api/alerts/{bridgeId}" \
  -H "Authorization: Bearer $TOKEN"
```

### Scenario 3: Test High Risk Alert
```bash
# Create data with high risk score to trigger alert
curl -X POST http://localhost:5000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "bridgeId":"{bridgeId}",
    "vibration":80,
    "load":90,
    "crack":10,
    "temperature":35,
    "riskScore":85
  }'

# Check if alert was created
curl -X GET "http://localhost:5000/api/alerts/{bridgeId}" \
  -H "Authorization: Bearer $TOKEN"
```

## ⚠️ Error Handling

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Not authorized to perform this action"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Bridge not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 💡 Tips & Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Store token after login** for subsequent requests
3. **Set token expiration** to refresh periodically (default 7 days)
4. **Test error cases** with invalid data or missing fields
5. **Monitor timings** to ensure API performance
6. **Use MongoDB ObjectId** format for IDs
7. **Validate date ranges** for historical queries
8. **Check role-based access** with different user types
9. **Test CORS** with frontend requests
10. **Rate limit** production deployments

## 🔗 Related Documentation

- [Backend README](./backend/README.md)
- [Production Upgrade Guide](./PRODUCTION_UPGRADE.md)
- [Quick Start Guide](./QUICK_START.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

---

Version: 2.0.0 | Last Updated: February 27, 2026
