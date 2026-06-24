# Quick Start Guide - CampusIQ

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 14+
- MongoDB running locally

### Step 1: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusiq
JWT_SECRET=your_secret_key_here" > .env

# Seed sample data
npm run seed

# Start server
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 2: Setup Frontend

```bash
cd frontend/admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Step 3: Login

Use credentials from seed data:
- **Email**: admin@university.edu
- **Password**: password123

## 📊 What's Been Updated

### Backend
- ✅ Added Student, Placement, Activity models
- ✅ Created dashboard API endpoints
- ✅ Added authentication middleware
- ✅ Created seed data script

### Frontend
- ✅ Removed all dummy data
- ✅ Connected to real backend APIs
- ✅ Updated login/signup to use authentication
- ✅ Dashboard fetches real data from backend

## 🔌 API Endpoints

All endpoints require Bearer token authentication:

```
POST   /api/admins/register        - Register admin
POST   /api/admins/login           - Login admin
GET    /api/admins/                - Get all admins (protected)

GET    /api/dashboard/stats         - Dashboard statistics
GET    /api/dashboard/top-students  - Top 8 students
GET    /api/dashboard/students      - All students
GET    /api/dashboard/performance   - Monthly performance data
GET    /api/dashboard/branch-distribution - Students by branch
GET    /api/dashboard/recent-activities   - Recent activities
GET    /api/dashboard/placement-drives    - All placement drives
```

## 🧪 Test the Integration

1. Login with seed credentials
2. Check dashboard - it should display real data:
   - 8 sample students
   - 4 placement drives
   - Monthly performance chart
   - Activity feed

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Student.js      ← NEW
│   │   ├── Placement.js    ← NEW
│   │   └── Activity.js     ← NEW
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── dashboardController.js ← NEW
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   └── dashboardRoutes.js ← NEW
│   ├── middleware/
│   ├── config/
│   └── server.js (updated)
├── seed.js ← NEW
└── package.json

frontend/admin/
├── src/
│   ├── services/
│   │   └── apiClient.ts ← NEW
│   ├── app/
│   │   └── App.tsx (updated)
│   └── ...
├── .env.local ← NEW
├── .env.example ← NEW
└── ...
```

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
- Make sure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file

**"API not responding"**
- Make sure backend is running: `npm run dev` in backend folder
- Check that VITE_API_URL in frontend/.env.local points to http://localhost:5000/api

**"Login fails"**
- Run seed script again: `npm run seed`
- Check that JWT_SECRET is set in backend .env

## 📚 Learn More

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed documentation of all changes.
