## 📝 WebSocket-Powered Kanban Board - Project README
## 🚀 Project Overview
A real-time collaborative Kanban board application built with React, Node.js, and WebSockets (Socket.IO). This application allows multiple users to collaborate on tasks in real-time, with features including task management, file uploads, priority tracking, and progress visualization.

## ✨ Live Demo
🔗 Frontend: http://localhost:3000
🔗 Backend API: http://localhost:5000
🔗 WebSocket Server: ws://localhost:5000

## 🎯 Features
🏗 Core Kanban Features
✅ Real-time task updates using WebSockets

✅ Drag & drop tasks between columns (To Do, In Progress, Done)

✅ Create, update, delete tasks with full CRUD operations

✅ Priority levels (Low, Medium, High) with color coding

✅ Task categories (Bug, Feature, Enhancement) with icons

✅ File attachments (images, PDFs, documents) with upload validation

## 📊 Visualization & Analytics
✅ Progress charts using Recharts

✅ Task distribution by status and priority

✅ Completion percentage calculation

✅ Real-time chart updates as tasks move

## 🤝 Collaboration Features
✅ Multi-user real-time sync - see changes instantly

✅ Task assignee tracking

✅ Connection status indicator

✅ Error handling for disconnected clients

## 🧪 Testing (Comprehensive)
✅ Unit Tests - Component testing with Vitest

✅ Integration Tests - WebSocket event flows

✅ E2E Tests - User workflows with Playwright

✅ Test coverage reports with Vitest coverage

## 📁 Project Structure

websocket-kanban-vitest-playwright-2026/
│
├── backend/                         # Node.js WebSocket Server
│   ├── server.js                    # Express + Socket.IO server
│   ├── uploads/                     # File upload storage
│   └── package.json
│
├── frontend/                        # React Application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── KanbanBoard.jsx     # Main board component
│   │   │   ├── Column.jsx          # Individual column
│   │   │   ├── Task.jsx            # Task card with drag & drop
│   │   │   ├── TaskForm.jsx        # Task creation/editing form
│   │   │   └── ProgressChart.jsx   # Charts for task analytics
│   │   │
│   │   ├── context/                 # React Context
│   │   │   └── TaskContext.jsx     # Global task state management
│   │   │
│   │   ├── services/                # API services
│   │   │   ├── socket.js           # WebSocket connection setup
│   │   │   └── api.js              # REST API calls (uploads)
│   │   │
│   │   ├── styles/                  # Component CSS files
│   │   │   ├── KanbanBoard.css
│   │   │   ├── Task.css
│   │   │   ├── Column.css
│   │   │   ├── TaskForm.css
│   │   │   └── ProgressChart.css
│   │   │
│   │   ├── constants/               # Constants and configurations
│   │   │   └── index.js            # Column definitions, priorities, categories
│   │   │
│   │   ├── tests/                   # Test files
│   │   │   ├── unit/               # Unit tests (Vitest)
│   │   │   ├── integration/        # Integration tests
│   │   │   └── e2e/                # Playwright test files
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   │
│   ├── e2e/                        # Playwright E2E tests
│   ├── public/                     # Static files
│   └── package.json
│
└── README.md                       # This file

## 🔌 WebSocket Events
The application uses the following Socket.IO events:

## 📤 Client → Server Events
task:create - Create a new task

task:update - Update an existing task

task:move - Move task between columns

task:delete - Delete a task

## 📥 Server → Client Events
sync:tasks - Send all tasks to new client

task:created - Broadcast new task to all clients

task:updated - Broadcast task update to all clients

task:moved - Broadcast task move to all clients

task:deleted - Broadcast task deletion to all clients

## 🌐 REST API Endpoints
Method	Endpoint	Description
POST	/api/upload	Upload files (images, PDFs, documents)
GET	/uploads/:filename	Access uploaded files
🛠 Technology Stack
Frontend
React 18 - UI library

React DnD - Drag and drop functionality

Socket.IO Client - WebSocket communication

Recharts - Data visualization

Axios - HTTP requests

Vitest + React Testing Library - Unit/Integration testing

Playwright - E2E testing

Backend
Node.js + Express - Server framework

Socket.IO - Real-time WebSocket communication

Multer - File upload handling

CORS - Cross-origin resource sharing

## 🚀 Setup & Installation
Prerequisites
Node.js (v16 or higher)

npm or yarn

Git

1. Clone the Repository
bash
git clone https://github.com/vyorius/websocket-kanban-vitest-playwright-2026.git
cd websocket-kanban-vitest-playwright-2026

2. Backend Setup

bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
3. Frontend Setup

bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
## 🧪 Running Tests
Unit & Integration Tests (Vitest)

## bash
cd frontend
npm test                    # Run all tests
npm run test:unit          # Run only unit tests
npm run coverage           # Generate test coverage report
E2E Tests (Playwright)

## bash
cd frontend
npm run test:e2e           # Run E2E tests in headless mode
npm run test:e2e:headed   # Run E2E tests with browser UI
npm run test:e2e:ui       # Open Playwright test UI

## 📊 Test Coverage Areas
Test Type	Coverage	Tools Used
Unit Tests	Components, utility functions	Vitest, React Testing Library
Integration Tests	Component interactions, WebSocket events	Vitest, React Testing Library
E2E Tests	User workflows, drag & drop, file upload	Playwright

## 🎨 UI Components
Kanban Board Layout
text
┌─────────────────────────────────────────────────────┐
│                    Kanban Board                      │
├─────────────┬──────────────┬─────────────────┤
│   To Do     │ In Progress  │      Done       │
│  (Blue)     │   (Orange)   │    (Green)      │
├─────────────┼──────────────┼─────────────────┤
│ • Task 1    │ • Task 2     │ • Task 3        │
│ • Task 4    │              │ • Task 5        │
│             │              │                 │
├─────────────┴──────────────┴─────────────────┤
│               Progress Charts                  │
└───────────────────────────────────────────────┘

## Task Card Features
✅ Drag handle - Click and drag to move

✅ Priority badge - Color-coded (Red=High, Orange=Medium, Green=Low)

✅ Category icon - 🐛 Bug, ✨ Feature, 🔧 Enhancement

✅ Edit/Delete buttons - Inline editing

✅ Assignee - User assignment display

✅ Attachments - File preview/indicator

## 🔧 Configuration

Environment Variables
Create .env file in frontend root:

## env
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000/api
File Upload Configuration
Max file size: 5MB

Allowed types: jpg, jpeg, png, gif, pdf, doc, docx

Storage: Local uploads/ directory

## 📱 Responsive Design
The application is fully responsive:

Desktop: 3-column layout

Tablet: 2-column layout

Mobile: 1-column layout with touch-friendly drag & drop

## 🔐 Security Features
File validation - Type and size checking

Input sanitization - Form field validation

CORS configuration - Restricted origins

Error boundaries - Graceful error handling

## 📈 Performance Optimizations
WebSocket optimization - Efficient event broadcasting

Virtual scrolling - For large task lists (planned)

Image optimization - Compressed uploads

Lazy loading - Code splitting for components

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add some AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

## 📋 Development Workflow
bash
# 1. Start backend server
cd backend && npm start

# 2. Start frontend development server
cd frontend && npm start

# 3. Run tests during development
npm test -- --watch

# 4. Run E2E tests before commit
npm run test:e2e
## 🐛 Troubleshooting

Common Issues
WebSocket Connection Failed

Ensure backend is running on port 5000

Check CORS configuration in backend

Verify no firewall blocking WebSocket connections

File Upload Issues

Check uploads/ directory exists and is writable

Verify file size (< 5MB) and type restrictions

Check multer configuration

Drag & Drop Not Working

Verify React DnD backend is properly configured

Check for touch vs mouse backends on mobile/desktop

Ensure proper drop targets are configured

Debugging Tips
javascript
// Enable Socket.IO debug logging
localStorage.debug = 'socket.io-client:*';

// Check WebSocket connection
socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('disconnect', () => console.log('Disconnected'));
## 📚 Learning Resources
WebSockets & Real-time Apps
Socket.IO Documentation

MDN WebSocket API

Real-time Web Applications

React & Testing
React Testing Library

Vitest Documentation

Playwright Documentation

Kanban Methodology
Atlassian Kanban Guide

Kanban vs Scrum

## 🏆 Evaluation Criteria
This project demonstrates proficiency in:

Skill	Implementation
React	Component architecture, state management, hooks
WebSockets	Real-time updates, event handling, error recovery
Testing	Unit, integration, E2E testing with high coverage
UI/UX	Responsive design, intuitive interactions
Code Quality	Clean architecture, documentation, best practices


# 👥 Acknowledgments
Icons: Emoji icons for categories and priorities

Charts: Recharts library for data visualization

Testing: Vitest and Playwright teams for excellent testing tools

Inspiration: Trello, Jira, and other Kanban tools

# 📞 Support
For issues, questions, or contributions:

Check the Issues page

Create a new issue with detailed description

Include steps to reproduce, expected vs actual behavior

# Built by Sahil Shinde for real-time collaboration
# Happy task managing! 🎯