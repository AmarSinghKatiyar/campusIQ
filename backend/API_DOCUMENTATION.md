# CampusIQ Backend API Documentation

## Project Overview

**CampusIQ** is a Campus Placement Management System built with:
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with cookie-based storage
- **File Upload**: Multer + Cloudinary
- **Other**: Bcryptjs for password hashing, CORS enabled

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Environment Variables](#environment-variables)
3. [API Endpoints](#api-endpoints)
4. [Testing Guide](#testing-guide)
5. [Error Handling](#error-handling)
6. [Security Features](#security-features)

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/campusiq?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_32_character_secret_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_EXPIRE` | Token expiry time | `7d`, `24h`, etc. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary dashboard |

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Student Profile Endpoints

#### 1. Get Student Profile
**GET** `/students/profile`

**Protected**: ✅ Yes (Requires JWT in cookies)

**Description**: Retrieve the logged-in student's complete profile

**Headers**:
```
Cookie: token=<jwt_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "65a1c2d3e4f5a6b7c8d9e0f1",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "20210001",
    "branch": "CSE",
    "graduationYear": 2025,
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "resumeUrl": "https://res.cloudinary.com/...",
    "githubUrl": "https://github.com/johndoe",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "phoneNumber": "9876543210",
    "placementStatus": "Applied",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

---

#### 2. Update Student Profile
**PUT** `/students/profile`

**Protected**: ✅ Yes (Requires JWT in cookies)

**Description**: Update allowed profile fields (name, cgpa, skills, githubUrl, linkedinUrl, phoneNumber)

**Headers**:
```
Content-Type: application/json
Cookie: token=<jwt_token>
```

**Request Body**:
```json
{
  "name": "John Doe Updated",
  "cgpa": 8.8,
  "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Python"],
  "githubUrl": "https://github.com/johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "phoneNumber": "9876543211"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "65a1c2d3e4f5a6b7c8d9e0f1",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "rollNumber": "20210001",
    "branch": "CSE",
    "graduationYear": 2025,
    "cgpa": 8.8,
    "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Python"],
    "resumeUrl": "https://res.cloudinary.com/...",
    "githubUrl": "https://github.com/johndoe",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "phoneNumber": "9876543211",
    "placementStatus": "Applied",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:50:00Z"
  }
}
```

**Validation Rules**:
- `name`: 2-50 characters
- `cgpa`: 0-10
- `phoneNumber`: Exactly 10 digits
- `skills`: Max 20 items
- `githubUrl`: Valid GitHub URL format
- `linkedinUrl`: Valid LinkedIn URL format

---

#### 3. Upload Resume
**POST** `/students/upload-resume`

**Protected**: ✅ Yes (Requires JWT in cookies)

**Description**: Upload a PDF resume to Cloudinary

**Headers**:
```
Cookie: token=<jwt_token>
```

**Request Body** (Form Data):
```
Key: resume
Value: <PDF file>
```

**File Requirements**:
- Format: PDF only
- Max size: 5MB
- Field name: `resume`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "student": {
      "_id": "65a1c2d3e4f5a6b7c8d9e0f1",
      "name": "John Doe",
      "email": "john@example.com",
      "rollNumber": "20210001",
      "branch": "CSE",
      "graduationYear": 2025,
      "cgpa": 8.5,
      "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
      "resumeUrl": "https://res.cloudinary.com/campusiq-resumes/...",
      "githubUrl": "https://github.com/johndoe",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "phoneNumber": "9876543210",
      "placementStatus": "Applied"
    },
    "resumeUrl": "https://res.cloudinary.com/campusiq-resumes/..."
  }
}
```

---

#### 4. Delete Resume
**DELETE** `/students/resume`

**Protected**: ✅ Yes (Requires JWT in cookies)

**Description**: Delete student's uploaded resume from Cloudinary

**Headers**:
```
Cookie: token=<jwt_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resume deleted successfully",
  "data": {
    "_id": "65a1c2d3e4f5a6b7c8d9e0f1",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "20210001",
    "branch": "CSE",
    "graduationYear": 2025,
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "resumeUrl": null,
    "githubUrl": "https://github.com/johndoe",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "phoneNumber": "9876543210",
    "placementStatus": "Applied"
  }
}
```

---

## Testing Guide

### Using Postman

#### Setup:
1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new Postman Collection named "CampusIQ"
3. Add the following requests

#### Test 1: Get Profile

**Request:**
- **Method**: GET
- **URL**: `http://localhost:5000/api/students/profile`
- **Headers**:
  - `Cookie`: `token=your_jwt_token_here`
  
**Instructions**:
1. Get a valid JWT token (from login API - to be implemented)
2. Copy the token value
3. Click "Cookies" button in Postman
4. Add new cookie: `token` = `<your_jwt_token>`
5. Send request

**Expected Response**: 200 OK with student profile data

---

#### Test 2: Update Profile

**Request:**
- **Method**: PUT
- **URL**: `http://localhost:5000/api/students/profile`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Cookie`: `token=your_jwt_token_here`

**Body** (JSON):
```json
{
  "name": "Jane Doe",
  "cgpa": 9.0,
  "skills": ["Python", "Django", "PostgreSQL"],
  "phoneNumber": "9876543210",
  "githubUrl": "https://github.com/janedoe",
  "linkedinUrl": "https://linkedin.com/in/janedoe"
}
```

**Expected Response**: 200 OK with updated profile

---

#### Test 3: Upload Resume

**Request:**
- **Method**: POST
- **URL**: `http://localhost:5000/api/students/upload-resume`
- **Headers**:
  - `Cookie**: `token=your_jwt_token_here`

**Body** (Form Data):
- **Key**: `resume`
- **Value**: Select your PDF file

**Steps in Postman**:
1. Go to "Body" tab
2. Select "form-data"
3. Key: `resume`, Value type: "File", Upload your PDF
4. Send request

**Expected Response**: 200 OK with Cloudinary URL

---

#### Test 4: Delete Resume

**Request:**
- **Method**: DELETE
- **URL**: `http://localhost:5000/api/students/resume`
- **Headers**:
  - `Cookie**: `token=your_jwt_token_here`

**Expected Response**: 200 OK with profile (resumeUrl = null)

---

### Using cURL

#### Test Get Profile:
```bash
curl -X GET "http://localhost:5000/api/students/profile" \
  -H "Cookie: token=your_jwt_token_here" \
  -H "Content-Type: application/json"
```

#### Test Update Profile:
```bash
curl -X PUT "http://localhost:5000/api/students/profile" \
  -H "Cookie: token=your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "cgpa": 9.0,
    "skills": ["Python", "Django"],
    "phoneNumber": "9876543210"
  }'
```

#### Test Upload Resume:
```bash
curl -X POST "http://localhost:5000/api/students/upload-resume" \
  -H "Cookie: token=your_jwt_token_here" \
  -F "resume=@/path/to/resume.pdf"
```

#### Test Delete Resume:
```bash
curl -X DELETE "http://localhost:5000/api/students/resume" \
  -H "Cookie: token=your_jwt_token_here"
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional: validation error details
}
```

### Common Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "CGPA must be between 0 and 10",
    "Phone number must be exactly 10 digits"
  ]
}
```

#### 401 Unauthorized - No Token
```json
{
  "success": false,
  "message": "Not authorized to access this route. Please login first."
}
```

#### 401 Unauthorized - Invalid Token
```json
{
  "success": false,
  "message": "Invalid token. Please login again."
}
```

#### 401 Unauthorized - Expired Token
```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

#### 404 Not Found - File Not Found
```json
{
  "success": false,
  "message": "No resume found to delete"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error retrieving profile: Database connection failed"
}
```

---

## Security Features

### 1. **Password Hashing**
- Passwords are hashed using bcryptjs (salt rounds: 10)
- Passwords are never returned in API responses
- Passwords are never logged

### 2. **JWT Authentication**
- Tokens are issued with expiry time (default: 7 days)
- Tokens are stored in secure, httpOnly cookies
- Tokens are verified on every protected route

### 3. **Data Validation**
- All inputs are validated before processing
- Email validation using regex
- Phone number: Exactly 10 digits
- CGPA: 0-10 range
- URL validation for GitHub and LinkedIn

### 4. **CORS Protection**
- CORS enabled only for frontend URL
- Credentials (cookies) allowed only from trusted origin

### 5. **File Upload Security**
- Only PDF files accepted
- File size limited to 5MB
- Files uploaded to Cloudinary (secure CDN)
- Files organized in folders by student ID

### 6. **MongoDB Security**
- Connection string uses MongoDB Atlas SSL
- Unique indexes on email and rollNumber
- Schema validation at database level

---

## Folder Structure

```
backend/
├── config/
│   ├── db.js                 # Database connection
│   └── cloudinary.js         # Cloudinary configuration
├── models/
│   └── Student.js            # Student schema and model
├── controllers/
│   └── studentController.js  # Student business logic
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   └── uploadMiddleware.js   # File upload handling
├── routes/
│   └── studentRoutes.js      # Route definitions
├── src/
│   └── app.js                # Express app configuration
├── .env                       # Environment variables
├── package.json              # Dependencies
└── server.js                 # Server entry point
```

---

## Next Steps

To complete the backend, implement:

1. **Authentication Module**
   - POST /api/auth/register - Student registration
   - POST /api/auth/login - Student login
   - POST /api/auth/logout - Student logout
   - POST /api/auth/refresh-token - Refresh JWT token

2. **Additional Features**
   - Company management
   - Job postings
   - Applications
   - Interview schedules
   - Admin dashboard

3. **Email Integration**
   - Verification emails
   - Job notification emails
   - Interview reminder emails

---

## Support & Debugging

### Enable Debug Logging:
```bash
DEBUG=* npm run dev
```

### Common Issues:

**Issue**: Cannot connect to MongoDB
- **Solution**: Check MONGODB_URI in .env is correct
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)

**Issue**: Cloudinary upload fails
- **Solution**: Verify CLOUDINARY_CLOUD_NAME, API_KEY, and API_SECRET
- Check file is valid PDF and under 5MB

**Issue**: JWT token not working
- **Solution**: Ensure token is stored in cookies, not headers
- Token format: `token=<jwt_string>` in Cookie header

---

## Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set up MongoDB Atlas backups
- [ ] Configure Cloudinary CDN settings
- [ ] Add rate limiting middleware
- [ ] Set up error logging (Sentry, etc.)
- [ ] Configure firewall and security groups
- [ ] Test all endpoints with real data
- [ ] Set up monitoring and alerts

---

**Last Updated**: June 24, 2026
**Version**: 1.0.0
