# CampusIQ - Admin Frontend to Backend Integration

## Summary of Changes

This document describes all the changes made to connect the admin frontend to the backend and remove dummy values.

### Backend Changes

#### 1. **New Models Created**

**Student Model** (`backend/src/models/Student.js`)
- Fields: name, email, rollNumber, branch, cgpa, batch, isEligible, placementStatus, companyPlaced, salary, profileCompletion
- Used to store student information and placement status

**Placement Model** (`backend/src/models/Placement.js`)
- Fields: companyName, ctc, jobRole, registeredStudents, selectedStudents, status, startDate, endDate, eligibilityCriteria
- Used to store recruitment drive information

**Activity Model** (`backend/src/models/Activity.js`)
- Fields: type, text, relatedStudentId, relatedPlacementId
- Used to store system activities for the activity feed

#### 2. **Updated Models**

**Admin Model** (`backend/src/models/Admin.js`)
- Added `role` field (enum: ['admin'], default: 'admin')
- Enables role-based access control for future extensions

#### 3. **New Dashboard Controller** (`backend/src/controllers/dashboardController.js`)

API endpoints for dashboard data:
- `getDashboardStats()` - Returns total students, eligible students, placed students, placement rate, active drives
- `getTopStudents()` - Returns top 8 students sorted by CGPA with badges
- `getRecentActivities()` - Returns recent activities with formatted timestamps
- `getPerformanceData()` - Returns 12-month performance data (monthly average scores and placements)
- `getBranchDistribution()` - Returns student count by branch
- `getAllStudents()` - Returns all students for student management page
- `getAllPlacementDrives()` - Returns all placement drives

#### 4. **New Dashboard Routes** (`backend/src/routes/dashboardRoutes.js`)

Protected routes (require authentication):
```
GET  /api/dashboard/stats
GET  /api/dashboard/top-students
GET  /api/dashboard/students
GET  /api/dashboard/branch-distribution
GET  /api/dashboard/recent-activities
GET  /api/dashboard/performance
GET  /api/dashboard/placement-drives
```

All routes require Bearer token authentication via `protect` middleware and admin role via `adminOnly` middleware.

#### 5. **Updated Server** (`backend/src/server.js`)
- Imported and registered dashboard routes at `/api/dashboard`

#### 6. **Seed Data Script** (`backend/seed.js`)
- Creates sample data for testing:
  - 8 sample students with various branches and placement statuses
  - 4 sample placement drives
  - 6 sample activities
  - 1 admin user (email: admin@university.edu, password: password123)

**To run seed data:**
```bash
cd backend
npm run seed
```

### Frontend Changes

#### 1. **API Client Service** (`frontend/admin/src/services/apiClient.ts`)

Created a centralized API client with methods for:
- `loginAdmin()` - Login with email and password
- `registerAdmin()` - Register new admin account
- `logoutAdmin()` - Logout and clear token
- `getToken()` - Get stored JWT token
- Dashboard data fetching methods:
  - `getDashboardStats()`
  - `getTopStudents()`
  - `getRecentActivities()`
  - `getPerformanceData()`
  - `getBranchDistribution()`
  - `getAllStudents()`
  - `getAllPlacementDrives()`

All requests include the Bearer token from localStorage for authentication.

#### 2. **Environment Configuration**

Created `.env.local` and `.env.example` files:
```
VITE_API_URL=http://localhost:5000/api
```

#### 3. **Updated App.tsx**

**Removed:**
- All dummy data constants (topStudents, performanceData, branchData, recentActivities)

**Updated Components:**
- **LoginPage**: Now uses `apiClient.loginAdmin()` to authenticate with backend
- **SignUpPage**: Now uses `apiClient.registerAdmin()` to create admin accounts
- **DashboardHome**: Completely refactored to:
  - Fetch real data from backend APIs
  - Manage its own loading state
  - Display real stats, students, performance data, activities
  - Handle API errors gracefully with toast notifications
- **DashboardLayout**: Simplified to remove unnecessary loading state management
- **App Root**: Updated logout handler to clear authentication token

#### 4. **Data Binding**

Dashboard now displays:
- **Stat Cards**: Real data from `getDashboardStats()`
- **Performance Chart**: Monthly data from `getPerformanceData()`
- **Top Students Table**: Real student data from `getTopStudents()`
- **Branch Distribution**: Real data from `getBranchDistribution()`
- **Recent Activities**: Real activities from `getRecentActivities()`

## Setup Instructions

### Prerequisites
- Node.js 14+ installed
- MongoDB running locally or connection string in `.env`
- Backend and frontend in the same repository structure

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file in backend directory**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campusiq
   JWT_SECRET=your_secret_key_here
   ```

3. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend/admin
   npm install
   ```

2. **Start frontend development server**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:5173 (or other port)

3. **Ensure .env.local is configured**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Testing the Integration

1. Start both backend and frontend servers
2. Navigate to frontend (http://localhost:5173)
3. Sign up with new account or use seed data:
   - Email: admin@university.edu
   - Password: password123
4. Login to access dashboard
5. Dashboard will fetch and display real data from backend
6. Check browser console for any API errors

## API Authentication

All dashboard routes require authentication:
- Login generates a JWT token stored in localStorage
- Token is automatically included in all API requests as `Authorization: Bearer <token>`
- Logout clears the token from localStorage

## Data Flow

```
Frontend (React)
    ↓
API Client (apiClient.ts)
    ↓
Backend Express Server (server.js)
    ↓
Dashboard Routes (dashboardRoutes.js)
    ↓
Dashboard Controller (dashboardController.js)
    ↓
MongoDB Collections
    ↑
Response back through same chain
```

## Key Improvements

✅ **Real-time Data**: Dashboard now displays actual database data instead of hardcoded values
✅ **Scalable Architecture**: Data model supports all future features (rankings, placements, reports)
✅ **Type-Safe**: TypeScript types for API responses
✅ **Error Handling**: Proper error messages and toasts for user feedback
✅ **Authentication**: Secure JWT-based authentication for all endpoints
✅ **Sample Data**: Seed script for easy testing and development
✅ **Modular Code**: Separated concerns (models, controllers, routes, services)

## Next Steps

1. **Admin Features**: Implement admin dashboard for creating placement drives, managing students
2. **Student Portal**: Create student-facing features (profile, apply to drives)
3. **Rankings**: Implement AI-based student ranking system
4. **Reports**: Add report generation and export features
5. **Notifications**: Add real-time notifications for important events
6. **Search & Filter**: Add advanced search and filtering capabilities
