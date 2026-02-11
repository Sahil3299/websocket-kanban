const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// In-memory storage (in production, use database)
const users = [
  {
    id: '1',
    email: 'admin@kanban.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqJXKpQ7zZQ8lH9q3z5b6', // password: "admin123"
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

const userSessions = {}; // Store active user sessions
let tasks = [
  {
    id: '1',
    title: 'Setup project structure',
    description: 'Initialize backend and frontend',
    column: 'todo',
    priority: 'high',
    category: 'feature',
    attachments: [],
    createdAt: new Date().toISOString(),
    userId: '1',
    assignee: null
  }
];

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.user = decoded;
    next();
  });
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and document files are allowed'));
    }
  }
});

// 🔐 Auth Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name,
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store session
    userSessions[user.id] = {
      lastActive: new Date().toISOString()
    };

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user (protected route)
app.get('/api/user', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  });
});

// File upload endpoint (protected)
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    filename: req.file.originalname,
    size: req.file.size
  });
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('User connected:', socket.user.name, socket.id);
  
  // Send current tasks to newly connected client
  socket.emit('sync:tasks', tasks.filter(task => {
    // Only show user's own tasks unless admin
    if (socket.user.role === 'admin') return true;
    return task.userId === socket.user.id;
  }));
  
  // Task creation
  socket.on('task:create', (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      userId: socket.user.id,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    
    // Emit to all connected clients
    io.emit('task:created', newTask);
  });
  
  // Task update
  socket.on('task:update', (updatedTask) => {
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      // Check permissions
      if (tasks[index].userId !== socket.user.id && socket.user.role !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized to update this task' });
      }
      tasks[index] = { ...tasks[index], ...updatedTask };
      io.emit('task:updated', tasks[index]);
    }
  });
  
  // Task move
  socket.on('task:move', ({ taskId, newColumn }) => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      // Check permissions
      if (tasks[index].userId !== socket.user.id && socket.user.role !== 'admin') {
        return socket.emit('error', { message: 'Unauthorized to move this task' });
      }
      tasks[index].column = newColumn;
      io.emit('task:moved', tasks[index]);
    }
  });
  
  // Task deletion
  socket.on('task:delete', (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Check permissions
    if (task.userId !== socket.user.id && socket.user.role !== 'admin') {
      return socket.emit('error', { message: 'Unauthorized to delete this task' });
    }
    
    tasks = tasks.filter(t => t.id !== taskId);
    io.emit('task:deleted', taskId);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.name, socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});