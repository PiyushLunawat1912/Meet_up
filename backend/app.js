const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require("mongoose");
const { Server } = require('socket.io');

const authRoutes = require("./routes/auth");
const conversationRoutes = require('./routes/conversation');
const UserAuth = require('./db/user');
const Conversation = require('./models/Conversation');
const groupRoutes = require('./routes/groupChat');
const GroupChat = require('./models/groupChat'); // ✅ Add this


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/group', groupRoutes);


// Root route
app.get("/", (req, res) => {
  res.send("API + Socket.IO Server Running");
});

// MongoDB Connection
async function connectDb() {
  await mongoose.connect("mongodb://localhost:27017/", {
    dbName: "Meet-Up_db",
  });
  console.log("MongoDB connected");
}
connectDb().catch(console.error);

// Create HTTP server to bind Socket.IO
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('send-message', async (data) => {
    try {
      // Get sender's name
      const senderUser = await UserAuth.findById(data.sender).select('name');
      if (!senderUser) return;

      // Build the message object with sender's name
      const fullMessage = {
        conversationId: data.conversationId,
        sender: {
          _id: senderUser._id,
          name: senderUser.name,
        },
        text: data.text,
        timestamp: data.timestamp || new Date(),
      };

      // Save the message to MongoDB
      await Conversation.findByIdAndUpdate(
        data.conversationId,
        {
          $push: {
            message: {
              sender: senderUser._id,
              text: data.text,
              timestamp: data.timestamp || new Date(),
            },
          },
        },
        { new: true }
      );

      // Emit the enriched message
      socket.to(data.conversationId).emit('receive-message', fullMessage);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

    socket.on('join-group', (groupId) => {
    socket.join(groupId);
  });

  socket.on('send-group-message', async (data) => {
    try {
      const senderUser = await UserAuth.findById(data.sender).select('name');
      if (!senderUser) return;

      const fullMessage = {
        sender: {
          _id: senderUser._id,
          name: senderUser.name
        },
        text: data.text,
        timestamp: data.timestamp || new Date()
      };

      await GroupChat.findByIdAndUpdate(
        data.groupId,
        { $push: { messages: { sender: senderUser._id, text: data.text, timestamp: data.timestamp } } }
      );

      socket.to(data.groupId).emit('receive-group-message', fullMessage);
    } catch (err) {
      console.error('Group message error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});



// Start both Express and Socket.IO servers on the same port
server.listen(port, () => {
  console.log(`Server (API + Socket.IO) running on http://localhost:${port}`);
});



