require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Auth routes ko import karna
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB se connect ho gaya! 📦'))
  .catch(err => console.log('MongoDB error:', err));

// API ROUTES
app.use('/api/auth', authRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: "Backend API ekdum zinda hai! 🚀" });
});

// Message Schema
const messageSchema = new mongoose.Schema({
  text: String,
  senderId: String,
  time: String
});
const Message = mongoose.model('Message', messageSchema);

// Real-time Chat Logic
io.on('connection', async (socket) => {
  console.log('Ek naya user connect hua:', socket.id);

  try {
    const oldMessages = await Message.find();
    socket.emit('load_old_messages', oldMessages);
  } catch (error) {
    console.log("Purane messages laane error:", error);
  }

  socket.on('send_message', async (data) => {
    try {
      const newMsg = new Message(data);
      await newMsg.save();
      io.emit('receive_message', data);
    } catch (error) {
      console.log("Message save error:", error);
    }
  });

  socket.on('clear_chat', async () => {
    try {
      await Message.deleteMany({});
      io.emit('chat_cleared');
    } catch (error) {
      console.log("Chat clear error:", error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnect ho gaya:', socket.id);
  });
});

// Frontend files serve karna
const frontendPath = path.join(__dirname, 'frontend/dist');
app.use(express.static(frontendPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    next();
  }
});

// Server Start
const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server Port ${port} par chal raha hai 🚀`);
});