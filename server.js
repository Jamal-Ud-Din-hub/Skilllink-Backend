const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const server = http.createServer(app);

// Optional: Socket setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
});

app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });
  

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('✅ MongoDB connected successfully');
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error('❌ MongoDB connection error:', error);
});
  

