require('dotenv').config(); 
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Security ke liye

// 1. Auth Routes Import (Jo humne pehle banaye the)
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // POST data (login/signup) read karne ke liye zaroori hai

const server = http.createServer(app);

// 2. Auth Routes ko use karna
app.use('/api/auth', authRoutes);

// Socket.io Setup
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB se connect ho gaya! 📦'))
  .catch(err => console.log('MongoDB error:', err));

// Message Schema (senderName bhi add kar diya hai)
const messageSchema = new mongoose.Schema({
  text: String,
  senderId: String,
  senderName: String, // User ka asli naam dikhane ke liye
  time: String
});
const Message = mongoose.model('Message', messageSchema);

// 3. Socket.io Middleware (Sirf logged-in users ko allow karega)
io.use((socket, next) => {
    const token = socket.handshake.auth.token; // Frontend se token aayega
    if (!token) return next(new Error("Authentication error: Login required"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // User ki info (id, role) socket mein save ho gayi
        next();
    } catch (err) {
        next(new Error("Authentication error: Invalid Token"));
    }
});

// Real-time Chat Logic
io.on('connection', async (socket) => {
  console.log('User connected:', socket.user.id);

  // Purane messages load karna
  try {
    const oldMessages = await Message.find();
    socket.emit('load_old_messages', oldMessages);
  } catch (error) {
    console.log("Error loading old messages:", error);
  }

  // Naya message aane par
  socket.on('send_message', async (data) => {
    try {
      // Data mein senderName auto-fill karna token se
      const newMsgData = {
          ...data,
          senderId: socket.user.id,
          // senderName frontend se bhi aa sakta hai ya database se fetch kar sakte hain
      };

      const newMsg = new Message(newMsgData);
      await newMsg.save();

      io.emit('receive_message', newMsgData);
    } catch (error) {
      console.log("Message save error:", error);
    }
  });

  // 🗑️ Secure Clear Chat (Sirf Admin kar sakta hai)
  socket.on('clear_chat', async () => {
    try {
      // Role check karna
      if (socket.user.role !== 'admin') {
          return socket.emit('error_message', 'Access Denied: Sirf Admin chat clear kar sakta hai');
      }

      await Message.deleteMany({}); 
      io.emit('chat_cleared'); 
      console.log("Chat cleared by Admin:", socket.user.id);
    } catch (error) {
      console.log("Clear chat error:", error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnect ho gaya:', socket.user.id);
  });
});

// Frontend files serve karna (Vite/React build)
const frontendPath = path.join(__dirname, 'frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Server Start
const port = process.env.PORT || 5000; // Codespace ke liye 5000 use karein
server.listen(port, '0.0.0.0', () => {
  console.log(`Server Port ${port} par chal raha hai 🚀`);
});
