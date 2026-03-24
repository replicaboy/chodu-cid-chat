require('dotenv').config(); // .env file ko read karne ke liye
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // Database ke liye

// 1. Auth routes ko import karna (Login/Register ke liye)
const authRoutes = require('./routes/authRoutes');

const app = express();

// --- MIDDLEWARES (Ye sabse upar hone chahiye) ---
app.use(cors());
app.use(express.json()); // YEH MISSING THA! Iske bina backend data nahi padh pata

const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB se connect ho gaya! 📦'))
  .catch(err => console.log('MongoDB error:', err));

// --- API ROUTES (Naya Code) ---
app.use('/api/auth', authRoutes);

// Test route (Check karne ke liye)
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend API ekdum zinda hai! 🚀" });
});

// Message ka structure (Schema)
const messageSchema = new mongoose.Schema({
  text: String,
  senderId: String,
  time: String
});
const Message = mongoose.model('Message', messageSchema);

// Real-time Chat Logic
io.on('connection', async (socket) => {
  console.log('Ek naya user connect hua:', socket.id);

  // Jaise hi koi aaye, usko database se purane messages bhej do
  try {
    const oldMessages = await Message.find();
    socket.emit('load_old_messages', oldMessages);
  } catch (error) {
    console.log("Purane messages laane mein error:", error);
  }

  // Naya message aane par
  socket.on('send_message', async (data) => {
    try {
      // 1. Database mein save karo
      const newMsg = new Message(data);
      await newMsg.save();

      // 2. Sabko bhej do
      io.emit('receive_message', data);
    } catch (error) {
      console.log("Message save karne mein error:", error);
    }
  });

  // 🗑️ Chat clear karne ka function
  socket.on('clear_chat', async () => {
    try {
      await Message.deleteMany({}); // Database se saare messages delete
      io.emit('chat_cleared'); // Sabko bata do ki screen saaf kar lo
    } catch (error) {
      console.log("Chat clear karne mein error:", error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnect ho gaya:', socket.id);
  });
});

// --- FRONTEND FILES SERVE KARNA (Sabse aakhri mein hona chahiye) ---
const frontendPath = path.join(__dirname, 'frontend/dist');
app.use(express.static(frontendPath));

app.use((req, res, next) => {
  // Dhyan rakhein ki ye sirf frontend pages ke liye chale, API requests ke liye nahi
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