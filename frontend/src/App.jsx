import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Navigation from './components/Navigation';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/DashBoard';
import KanbanBoard from './components/KanbanBoard';
import MyTasks from './components/MyTasks'; // Add this import
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div className="app">
              <Navigation />
              
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/board" element={
                  <ProtectedRoute>
                    <KanbanBoard />
                  </ProtectedRoute>
                } />
                
                {/* Add MyTasks route */}
                <Route path="/mytasks" element={
                  <ProtectedRoute>
                    <MyTasks />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </DndProvider>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;