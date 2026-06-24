# API Response Formats

## Authentication Endpoints

### POST /api/admins/register
**Request:**
```json
{
  "name": "Dr. Rajesh Kumar",
  "email": "admin@university.edu",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### POST /api/admins/login
**Request:**
```json
{
  "email": "admin@university.edu",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Dashboard Endpoints (All require Bearer token)

### GET /api/dashboard/stats
**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "eligibleStudents": 120,
    "placedStudents": 95,
    "placementRate": "63.3",
    "activePlacementDrives": 4
  }
}
```

### GET /api/dashboard/top-students
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "name": "Priya Sharma",
      "branch": "Computer Science",
      "cgpa": 9.8,
      "score": 97,
      "badge": "Exceptional",
      "placementStatus": "Placed",
      "companyPlaced": "Google"
    },
    ...
  ]
}
```

### GET /api/dashboard/performance
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "month": "Jan",
      "score": 72,
      "placements": 8
    },
    {
      "month": "Feb",
      "score": 75,
      "placements": 12
    },
    ...
  ]
}
```

### GET /api/dashboard/branch-distribution
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Computer Science",
      "value": 45,
      "color": "#4F46E5"
    },
    {
      "name": "Electronics",
      "value": 30,
      "color": "#10B981"
    },
    ...
  ]
}
```

### GET /api/dashboard/recent-activities
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "text": "Priya Sharma completed profile update",
      "time": "2 min ago",
      "type": "profile"
    },
    {
      "text": "TCS recruitment drive registered — 45 students applied",
      "time": "18 min ago",
      "type": "drive"
    },
    ...
  ]
}
```

### GET /api/dashboard/students
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Priya Sharma",
      "email": "priya.sharma@university.edu",
      "rollNumber": "CS001",
      "branch": "Computer Science",
      "cgpa": 9.8,
      "placementStatus": "Placed",
      "companyPlaced": "Google",
      "salary": 2400000
    },
    ...
  ]
}
```

### GET /api/dashboard/placement-drives
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "companyName": "Google",
      "ctc": 2400000,
      "jobRole": "Software Engineer",
      "registeredStudents": 45,
      "selectedStudents": 3,
      "status": "Completed",
      "startDate": "2024-12-01T00:00:00.000Z",
      "endDate": "2024-12-10T00:00:00.000Z",
      "eligibilityCriteria": {
        "minCGPA": 8.0,
        "branchesAllowed": ["Computer Science", "Electronics"]
      }
    },
    ...
  ]
}
```

---

## Error Responses

### 401 Unauthorized (No Token)
```json
{
  "message": "Not authorized, no token"
}
```

### 401 Unauthorized (Invalid Token)
```json
{
  "message": "Not authorized, token failed"
}
```

### 403 Forbidden (Not Admin)
```json
{
  "message": "Admin access only"
}
```

### 404 Not Found
```json
{
  "message": "Route not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Headers

**All requests should include:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Where `<token>` is the JWT returned from login or register.**

---

## Data Models

### Student Schema
```typescript
{
  name: String (required),
  email: String (required, unique),
  rollNumber: String (required, unique),
  branch: Enum['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'],
  cgpa: Number (0-10),
  batch: Number,
  isEligible: Boolean (default: true),
  placementStatus: Enum['Placed', 'Unplaced', 'In-Progress'],
  companyPlaced: String (nullable),
  salary: Number (nullable),
  profileCompletion: Number (0-100),
  createdAt: Date,
  updatedAt: Date
}
```

### Placement Schema
```typescript
{
  companyName: String (required),
  ctc: Number (required),
  jobRole: String (required),
  registeredStudents: Number,
  selectedStudents: Number,
  status: Enum['Active', 'Completed', 'Cancelled'],
  startDate: Date,
  endDate: Date (nullable),
  eligibilityCriteria: {
    minCGPA: Number,
    branchesAllowed: String[]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Schema
```typescript
{
  type: Enum['profile', 'drive', 'placement', 'ranking', 'report', 'other'],
  text: String (required),
  relatedStudentId: ObjectId (nullable, ref: 'Student'),
  relatedPlacementId: ObjectId (nullable, ref: 'Placement'),
  createdAt: Date,
  updatedAt: Date
}
```
