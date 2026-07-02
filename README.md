# 🚀 CampusIQ – AI-Powered Campus Recruitment Platform

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Render-Deployed-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" />
</p>

<p align="center">
  <strong>Connecting talented students with the right opportunities through AI-powered recruitment.</strong>
</p>

---

## 📖 About

**CampusIQ** is an AI-powered campus recruitment platform designed to simplify the hiring process for educational institutions and recruiters. The platform intelligently matches students with internships and job opportunities based on their skills, projects, academic profile, and career interests.

Students can build professional profiles, upload resumes, and apply for opportunities, while administrators can efficiently manage students, jobs, and recruitment activities through a centralized dashboard.

---

# ✨ Features

## 👨‍🎓 Student Portal

- 🔐 Secure Authentication
- 👤 Complete Student Profile
- 📄 Resume Upload & Management
- 💼 Internship & Job Listings
- 🤖 AI-Based Job Recommendations
- 📊 Personalized Dashboard
- 🛠 Skills & Projects Management
- 📈 Application Tracking
- 📱 Responsive Design

---

## 👨‍💼 Admin Portal

- 🔐 Secure Admin Authentication
- 📊 Dynamic Dashboard Analytics
- 👨‍🎓 Student Management
- 💼 Internship & Job Management
- 📁 Candidate Screening
- 📈 Recruitment Analytics
- ⚙️ API Driven Dashboard
- 📋 Administrative Controls

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- JavaScript
- CSS
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- REST APIs

## Deployment

- Render

---

# 📂 Project Structure

```text
CampusIQ
│
├── backend
│   ├── admin-backend
│   └── student-backend
│
├── frontend
│   ├── admin
│   └── student-frontend
│
└── README.md
```

---

# 🚀 Live Demo

## 👨‍🎓 Student Portal

**Live URL**

https://campusiq-student-frontend.onrender.com

Access the student dashboard to:

- Create and manage your profile
- Upload resumes
- Browse internships and jobs
- Track applications
- Receive AI-powered recommendations

---

## 👨‍💼 Admin Dashboard *(Development)*

**Live URL**

https://campusiq-1-08za.onrender.com

The admin dashboard provides:

- Student management
- Dashboard analytics
- Job & Internship Management
- Candidate Screening
- Administrative Controls

> **Note:** This deployment is intended for development and testing purposes. Features and APIs may change as development progresses.

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/AmarSinghKatiyar/campusIQ.git

cd campusIQ
```

---

## 2. Install Dependencies

### Student Backend

```bash
cd backend/student-backend
npm install
```

### Admin Backend

```bash
cd backend/admin-backend
npm install
```

### Student Frontend

```bash
cd frontend/student-frontend
npm install
```

### Admin Frontend

```bash
cd frontend/admin
npm install
```

---

## 3. Environment Variables

Create a `.env` file inside the backend folders.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

ADMIN_CLIENT_URL=http://localhost:5174
```

Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## 4. Run the Project

### Student Backend

```bash
cd backend/student-backend

npm run dev
```

---

### Admin Backend

```bash
cd backend/admin-backend

npm run dev
```

---

### Student Frontend

```bash
cd frontend/student-frontend

npm run dev
```

---

### Admin Frontend

```bash
cd frontend/admin

npm run dev
```

---

# 🚀 Deploying on Render

## Backend Deployment

Deploy both backend services separately.

### Student Backend

**Root Directory**

```
backend/student-backend
```

Build Command

```bash
npm install
```

Start Command

```bash
npm start
```

---

### Admin Backend

**Root Directory**

```
backend/admin-backend
```

Build Command

```bash
npm install
```

Start Command

```bash
npm start
```

Add all required environment variables before deploying.

---

## Frontend Deployment

Create two **Static Sites** on Render.

### Student Frontend

Root Directory

```
frontend/student-frontend
```

### Admin Frontend

Root Directory

```
frontend/admin
```

Build Command

```bash
npm install && npm run build
```

Publish Directory

```text
dist
```

Environment Variable

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

# 🔐 Authentication

- JWT Authentication
- Protected Routes
- Secure Password Hashing
- Role-Based Authorization

---

# 📦 API Modules

- Authentication
- Student Profile
- Resume Management
- Jobs & Internships
- Applications
- Dashboard Analytics
- Admin Management

---

# 📸 Screenshots

Add screenshots here.

Example:

- 🏠 Landing Page
- 👨‍🎓 Student Dashboard
- 👤 Student Profile
- 📄 Resume Section
- 💼 Job Listings
- 📊 Admin Dashboard
- 👥 Student Management

---

# 💡 Future Enhancements

- 🤖 AI Resume Analyzer
- 🎤 AI Mock Interview
- 📧 Email Notifications
- 💬 Real-Time Chat
- 🔔 Push Notifications
- 🏢 Recruiter Portal
- 📹 Video Interviews
- 📈 Advanced Analytics

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push your branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

# 🌟 Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

# 👨‍💻 Author

**Amar Singh Katiyar**

GitHub: https://github.com/AmarSinghKatiyar

---

<p align="center">
Made with ❤️ using the MERN Stack
</p>
