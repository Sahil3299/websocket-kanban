import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import { socket } from '../services/socket';
import '../styles/Column.css';

const Column = ({ id, title, tasks, color }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => handleDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = (taskId) => {
    socket.emit('task:move', { taskId, newColumn: id });
  };

  return (
    <div 
      ref={drop}
      className={`column ${isOver ? 'drop-over' : ''}`}
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div className="column-header">
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div className="tasks-list">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <div className="empty-column">
            <p>Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;