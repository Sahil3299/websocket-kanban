import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import { TaskContext } from '../context/TaskContext';
import '../styles/Column.css';

const Column = ({ id, title, tasks, color }) => {
  const { moveTask } = useContext(TaskContext);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => handleDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = (taskId) => {
    moveTask(taskId, id);
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