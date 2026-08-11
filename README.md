# 🔍 CampusFind – Campus Lost & Found Portal

CampusFind is a full-stack **MERN** (MongoDB, Express.js, React, Node.js) web application designed for college students to report lost belongings, post found items, search records, and manage their listings securely with JWT authentication.

Designed with **RescueNet**'s signature aesthetic: Quicksand typography, glassmorphism cards, glowing status badges (Lost 🔴, Found 🟢, Returned 🔵), and an emerald ocean dark theme.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), React Router v6, Axios, Lucide Icons, Custom CSS (Glassmorphism design system).
- **Backend**: Node.js, Express.js, JWT Authentication (`jsonwebtoken`), `bcryptjs` password hashing.
- **Database**: MongoDB (Mongoose) with automatic **In-Memory MongoDB fallback** for zero-setup local development, plus support for **MongoDB Atlas** in production.

---

## 📁 Directory Structure

```text
CampusFind/
├── server/                   # Express.js REST API
│   ├── config/database.js   # MongoDB connection & fallback
│   ├── middleware/auth.js   # JWT authentication guard
│   ├── models/User.js       # User schema (Name, Email, Password)
│   ├── models/Item.js       # Item schema (Title, Description, Status, Location, Date, Contact)
│   ├── routes/auth.js       # Register, Login, Me endpoints
│   ├── routes/items.js      # CRUD & Mark Returned endpoints
│   ├── .env                 # PORT, MONGO_URI, JWT_SECRET
│   └── server.js            # Main backend entry point
│
└── client/                   # Vite React Frontend
    ├── src/
    │   ├── api/             # Axios instance with JWT interceptor
    │   ├── components/      # Navbar, ItemCard, ItemFilter, ProtectedRoute
    │   ├── context/         # AuthContext state manager
    │   ├── pages/           # Home, Login, Register, AddItem, MyPosts
    │   ├── App.jsx          # React Router setup
    │   └── index.css        # RescueNet-inspired dark glass design system
    └── vite.config.js
```

---

## ⚡ Quick Start (Local Setup)

### 1. Install Dependencies
Open terminal in project root:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Run Application
Run backend and frontend servers in separate terminals:

```bash
# Terminal 1: Start Express Backend (runs on http://localhost:5000)
cd server
npm start

# Terminal 2: Start React Frontend (runs on http://localhost:5173)
cd client
npm run dev
```

> 💡 **No Database Download Needed!**
> When you run `npm start` in `server/`, an embedded in-memory MongoDB database initializes automatically and seeds sample campus posts (demo account: `alex.rivera@campus.edu` / `password123`).

---

## 🌐 How to Upload to GitHub & Deploy Live (Free)

### Step 1: Initialize Git & Push to GitHub
Run the following commands in the root directory (`CampusFind/`):

```bash
git init
git add .
git commit -m "Initial commit: CampusFind Lost & Found Portal"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/CampusFind.git
git push -u origin main
```

### Step 2: Deploy Free Database on MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 Cluster.
3. Under **Database Access**, create a database user & password.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
5. Copy your connection string (e.g. `mongodb+srv://username:password@cluster.mongodb.net/campusfind?retryWrites=true&w=majority`).

### Step 3: Deploy Backend on Render (Free)
1. Sign up at [Render.com](https://render.com/).
2. Create a **New Web Service** and connect your GitHub `CampusFind` repository.
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI` = *Your MongoDB Atlas Connection String*
   - `JWT_SECRET` = `campusfind_super_secret_jwt_key_2026`

### Step 4: Deploy Frontend on Vercel / Render (Free)
1. Sign up at [Vercel.com](https://vercel.com/).
2. Import your GitHub `CampusFind` repository.
3. Select **Root Directory**: `client`
4. Deploy! Vercel automatically builds and provides your live public URL.
