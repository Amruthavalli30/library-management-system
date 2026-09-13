# Library Management System

A full-stack library management system with authentication, role-based access control, and a complete borrow/return workflow.

## 🔗 Live Links

- **Live App:** https://library-management-system-virid-one.vercel.app
- **Backend API:** https://library-backend-i0t1.onrender.com
- **GitHub Repo:** https://github.com/Amruthavalli30/library-management-system

## Demo Credentials

Register your own account via the app — choose either "Member" or "Admin" role to explore both experiences.

> **Note:** The backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30-50 seconds to respond — this is expected behavior, not a bug.

## Features

- User registration and login with JWT authentication
- Role-based access control (Admin vs Member)
- Admin: add, edit, delete library items
- Members: browse, search, and borrow items
- Full borrow/return workflow with availability tracking
- Borrow history tracking

## Tech Stack

- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Auth:** JWT, bcrypt
- **Deployment:** Vercel (frontend), Render (backend)

## Running Locally

**Backend:**
```bash
cd backend
npm install
# create a .env file with MONGODB_URI, JWT_SECRET, PORT
node server.js
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```
