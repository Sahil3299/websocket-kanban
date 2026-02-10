const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// In-memory storage for tasks
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
    assignee: null
  },
  {
    id: '2',
    title: 'Fix login bug',
    description: 'Users cannot login on mobile',
    column: 'inprogress',
    priority: 'high',
    category: 'bug',
    attachments: [],
    createdAt: new Date().toISOString(),
    assignee: 'John Doe'
  },
  {
    id: '3',
    title: 'Update documentation',
    description: 'Add API documentation',
    column: 'done',
    priority: 'low',
    category: 'enhancement',
    attachments: [],
    createdAt: new Date().toISOString(),
    assignee: 'Jane Smith'
  }
];

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

// Socket.IO events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send current tasks to newly connected client
  socket.emit('sync:tasks', tasks);
  
  // Task creation
  socket.on('task:create', (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    io.emit('task:created', newTask);
  });
  
  // Task update
  socket.on('task:update', (updatedTask) => {
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      io.emit('task:updated', tasks[index]);
    }
  });
  
  // Task move (column change)
  socket.on('task:move', ({ taskId, newColumn }) => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index].column = newColumn;
      io.emit('task:moved', tasks[index]);
    }
  });
  
  // Task deletion
  socket.on('task:delete', (taskId) => {
    tasks = tasks.filter(t => t.id !== taskId);
    io.emit('task:deleted', taskId);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});