import React, { useState, useContext } from 'react';
import { useDrag } from 'react-dnd';
import { TaskContext } from '../context/TaskContext';
import '../styles/Task.css';

const Task = ({ task }) => {
  const { updateTask, deleteTask } = useContext(TaskContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336'
  };

  const categoryIcons = {
    bug: '🐛',
    feature: '✨',
    enhancement: '🔧'
  };

  const handleUpdate = () => {
    updateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <div 
      ref={drag}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      style={{ borderLeft: `4px solid ${priorityColors[task.priority]}` }}
    >
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
            className="edit-input"
            placeholder="Task title"
          />
          <textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
            className="edit-textarea"
            placeholder="Task description"
          />
          <div className="edit-actions">
            <button onClick={handleUpdate} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h4 className="task-title">{task.title}</h4>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)} className="icon-btn">✏️</button>
              <button onClick={handleDelete} className="icon-btn">🗑️</button>
            </div>
          </div>
          
          <p className="task-description">{task.description}</p>
          
          <div className="task-meta">
            <span className="task-category">
              {categoryIcons[task.category]} {task.category}
            </span>
            <span 
              className="task-priority"
              style={{ backgroundColor: priorityColors[task.priority] }}
            >
              {task.priority}
            </span>
          </div>

          {task.attachments && task.attachments.length > 0 && (
            <div className="task-attachments">
              <small>📎 {task.attachments.length} attachment(s)</small>
            </div>
          )}
          
          {task.assignee && (
            <div className="task-assignee">
              <small>👤 {task.assignee}</small>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Task;