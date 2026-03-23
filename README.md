# 💬 Chodu Cid Chat

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

A fully functional, real-time, and highly customizable full-stack chat application built using the **MERN Stack** (MongoDB, Express, React, Node.js) and **Socket.io**. 

This application provides a seamless, WhatsApp-lite messaging experience with a customized user interface, persistent database storage, and interactive random sound effects.

---

## ✨ Key Features

* **Real-Time Messaging:** Instant message delivery and reception powered by Socket.io, with zero latency.
* **Persistent Chat History:** All messages are securely stored and fetched from a cloud MongoDB Atlas database, ensuring no data is lost upon refresh.
* **Interactive Sound Effects:** A unique feature that plays a randomly selected sound effect from a custom pool (`sound1.mp3`, `sound2.mp3`, etc.) every time a message is sent.
* **Custom UI & Branding:** Features an attractive UI with a custom profile picture (`profile.jpeg`) and optimized dark/black message text for readability.
* **Auto-Scroll Logic:** Automatically scrolls to the newest message seamlessly.
* **'Clear Chat' Functionality:** A synchronized master button to delete all messages from the database and instantly clear the UI for all connected clients.
* **Production Ready:** Fully configured for deployment on Render.com with automated build scripts for both frontend and backend.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* CSS3 (Custom Styling)
* Socket.io-client

**Backend:**
* Node.js
* Express.js
* Socket.io
* Mongoose (MongoDB Object Modeling)

**Deployment:**
* Render.com (Web Service)
* MongoDB Atlas (Database)

---

## 🚀 Local Setup & Installation

Follow these steps to run this project on your local machine:

### 1. Clone the repository
```bash
git clone [https://github.com/replicaboy/chodu-cid-chat.git](https://github.com/replicaboy/chodu-cid-chat.git)
cd chodu-cid-chat

**### 2. Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

**### 3. Environment Variables**
MONGO_URI=your_mongodb_connection_string_here

**### 4. Build & Run**
The app will be running at http://localhost:3000

**📂 Project Structure**
/
├── frontend/               # React Frontend
│   ├── public/             
│   │   ├── profile.jpeg    # Custom Profile Picture
│   │   └── sounds/         # Custom MP3 sound effects
│   ├── src/                # React components (App.jsx)
│   └── package.json        
├── server.js               # Main Express & Socket.io Backend
├── package.json            # Backend dependencies & scripts
└── README.md               # Project documentation

**📜 Copyright & License**
© 2026 **HARIOM THAKUR**. All Rights Reserved.
This project and its original source code, design, and logic are the intellectual property of HARIOM THAKUR. Unauthorized copying, modification, distribution, or use of this project for commercial purposes without explicit permission is strictly prohibited.











