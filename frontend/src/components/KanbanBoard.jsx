import React, { useState, useContext } from 'react';
import { useDrop } from 'react-dnd';
import Column from './Column';
import TaskForm from './TaskForm';
import { TaskContext } from '../context/TaskContext';
import { socket } from '../services/socket';
import { columns } from '../constants';
import '../styles/KanbanBoard.css';

const KanbanBoard = () => {
  const { tasks, addTask } = useContext(TaskContext);
  const [showForm, setShowForm] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => handleDrop(item.id, 'backlog'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = (taskId, newColumn) => {
    socket.emit('task:move', { taskId, newColumn });
  };

  const handleCreateTask = (taskData) => {
    socket.emit('task:create', taskData);
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
        <div className={`status-indicator ${socket.connected ? 'connected' : 'disconnected'}`} />
        <span>{socket.connected ? 'Connected' : 'Disconnected'}</span>
      </div>
    </div>
  );
};

export default KanbanBoard;