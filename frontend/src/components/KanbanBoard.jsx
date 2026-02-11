import React, { useState, useContext } from 'react';
import Column from './Column';
import TaskForm from './TaskForm';
import { TaskContext } from '../context/TaskContext';
import { columns } from '../constants';
import '../styles/KanbanBoard.css';

const KanbanBoard = () => {
  const { tasks, addTask, isConnected } = useContext(TaskContext);
  const [showForm, setShowForm] = useState(false);

  const handleCreateTask = (taskData) => {
    addTask(taskData);
    setShowForm(false);
  };

  return (
    <div className="kanban-board">
      <div className="board-header">
        <h2>Project Tasks</h2>
        <button 
          className="create-task-btn"
          onClick={() => setShowForm(true)}
        >
          + New Task
        </button>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="columns-container">
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasks.filter(task => task.column === column.id)}
            color={column.color}
          />
        ))}
      </div>

      <div className="connection-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
        <span>{isConnected ? 'Connected to WebSocket' : 'Disconnected'}</span>
      </div>
    </div>
  );
};

export default KanbanBoard;