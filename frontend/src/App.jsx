import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import KanbanBoard from './components/KanbanBoard';
import ProgressChart from './components/ProgressChart';
import { TaskProvider } from './context/TaskContext';
import './App.css';

function App() {
  return (
    <TaskProvider>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <div className="app">
          <header className="app-header">
            <h1>📊 WebSocket Kanban Board</h1>
            <p>Real-time task management with team collaboration</p>
          </header>
          
          <div className="app-content">
            <div className="kanban-section">
              <KanbanBoard />
            </div>
            
            <div className="chart-section">
              <ProgressChart />
            </div>
          </div>
          
          <footer className="app-footer">
            <p>Connected in real-time via WebSocket • Drag tasks between columns</p>
          </footer>
        </div>
      </DndProvider>
    </TaskProvider>
  );
}

export default App;