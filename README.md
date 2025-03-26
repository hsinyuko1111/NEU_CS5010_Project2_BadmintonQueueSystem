# 🏸 Badminton Queue System

Welcome to the Badminton Queue System — a web-based app designed to fairly manage match rotations and play sessions for casual badminton groups. Whether you're playing by rounds or time slots, this app ensures everyone gets a turn and has fun!

## 💻 Features

- 🧑‍🤝‍🧑 Check-in system with user registration and login
- 🎮 Match Mode: Play in groups of 4 with match-based rotation
- ⏱ Timer Mode: 20-minute timed play sessions
- 🔐 Admin panel for user management (delete, checkout, reset)
- 📦 Data stored in Firestore + browser localStorage
- 🔊 Audio alert when rounds end

## Business Requirement

- [📄 View Business Requirements](./business_requirements.md)

## Mockup Interface

- [📄 View Mockup](./mockup.pdf)

## Modules Diagram

- [📄 View Diagram](./uml.png)

## Functional Programming Analysis

- [📄 View Analysis](./functional-programming-analysis.md)

## Youtube Vedio Introduction

- [📄 about this project](https://youtu.be/jpdqYXryx8Y) 
- [📄 functional programming analysis](https://youtu.be/IQ3fMO47ef0)


---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/badminton-queue-system.git
cd badminton-queue-system
```

### 2. Install dependencies

```
bash
npm install
```

### 3. Start the development server

```
bash
npm run dev
```

## 🧩 Modules Diagram (Relaxed Class-Like View)

```
css
🧠 App Root (main.jsx)
│
├── React Router ⤵
│   ├── "/"               → HomePage
│   ├── "/login"          → LoginPage
│   ├── "/register"       → RegisterPage
│   ├── "/match-mode"     → MatchModePage
│   ├── "/timer-mode"     → TimerModePage
│   ├── "/admin/delete"   → AdminDeletePage
│   ├── "/admin/checkout" → AdminCheckoutPage
│   └── "/admin/reset"    → AdminResetPage
│
├── 🏗 BaseTemplate (Layout Shell)
│   ├── NavBar
│   │   ├── Links to Timer/Match/Admin/Login/Register
│   └── Footer ("Made by Cindy 🥬🐥")
│
├── 📄 Pages (Each wrapped in BaseTemplate)
│   │
│   ├── HomePage
│   │   └── Intro text and instructions
│   │
│   ├── LoginPage
│   │   └── Form + 🔄 firestoreDB.verifyUser() + checkInUser()
│   │
│   ├── RegisterPage
│   │   └── Form + 🔄 firestoreDB.registerUser()
│   │
│   ├── MatchModePage
│   │   └── LiningSystem → MatchSystem.jsx
│   │
│   ├── TimerModePage
│   │   └── TimingSystem.jsx
│   │
│   └── Admin Pages (auth-guarded by AdminAuthGate)
│       ├── AdminDeletePage    → 🔄 firestoreDB.deleteUser()
│       ├── AdminCheckoutPage  → 🔄 firestoreDB.checkOutUser()
│       └── AdminResetPage     → 🔄 localStorage.clear()

├── 🔐 AdminAuthGate
│   ├── Session-based passcode check (stored in sessionStorage)
│   └── Wraps Admin pages and auto-logs out in 5 min
│
├── 🔁 MatchSystem.jsx (LiningSystem)
│   ├── State:
│   │   ├── users, rows, rowStatus, selectedUser
│   ├── Logic:
│   │   ├── getCheckedInUsers → firestoreDB.getUsers()
│   │   ├── moveToRow(), moveBackToList()
│   │   ├── startRow(), endRow() (+ playAlarm)
│   │   └── addNewRow()
│   └── Storage: localStorage["match-rows", "match-rowStatus"]
│
├── ⏱ TimingSystem.jsx
│   ├── Similar row logic + Adds timer support
│   │   ├── startTimes, finalTimes, timers
│   │   ├── startTimer(), restartTimer(), handleTimeout()
│   ├── Calls: firestoreDB.getUsers()
│   ├── Plays alarm on timeout/endRow
│   └── Storage: localStorage["timer-rows", "timer-rowStatus", "startTimes"]
│
└── 🔥 firestoreDB (Model/Controller Layer)
    ├── registerUser(username, email, password)
    ├── verifyUser(email, password)
    ├── checkInUser(userId)
    ├── checkOutUser(userId)
    ├── deleteUser(userId)
    └── getUsers() → All users from Firestore

```

## 🛠 Tech Stack

- Frontend: React + Vite

- Styling: Bootstrap + Custom CSS

- Auth/DB: Firestore

- Routing: React Router DOM

## 🔐 Admin Access

To access the admin pages, use the default passcode:

```
yaml
Passcode: 1234
```

Admin Pages:

- /admin/delete — Delete users

- /admin/checkout — Check out users manually

- /admin/reset — Clear local app data

## 📁 Project Structure

```
css
📦 src
├── components/
│   ├── MatchSystem.jsx
│   ├── TimingSystem.jsx
│   ├── BaseTemplate.jsx
│   └── AdminAuthGate.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── TimerModePage.jsx
│   ├── MatchModePage.jsx
│   ├── AdminDeletePage.jsx
│   ├── AdminCheckoutPage.jsx
│   └── AdminResetPage.jsx
├── db/
│   └── fireStore.js
└── main.jsx
```

## 💬 Feedback

I'd love to hear how it’s working for your group or any features you’d like to see!

Made with ❤️ by 🥬🐥 Cindy 🏸
