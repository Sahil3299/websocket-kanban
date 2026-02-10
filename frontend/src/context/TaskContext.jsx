import React, { createContext, useState, useEffect } from 'react';
import { socket } from '../services/socket';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Listen for task updates from server
    socket.on('sync:tasks', (initialTasks) => {
      setTasks(initialTasks);
    });

    socket.on('task:created', (newTask) => {
      setTasks(prev => [...prev, newTask]);
    });

    socket.on('task:updated', (updatedTask) => {
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    });

    socket.on('task:moved', (movedTask) => {
      setTasks(prev => prev.map(task => 
        task.id === movedTask.id ? movedTask : task
      ));
    });

    socket.on('task:deleted', (taskId) => {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    });

    return () => {
      socket.off('sync:tasks');
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:moved');
      socket.off('task:deleted');
    };
  }, []);

  const addTask = (task) => {
    socket.emit('task:create', task);
  };

  const updateTask = (taskId, updates) => {
    socket.emit('task:update', { id: taskId, ...updates });
  };

  const moveTask = (taskId, newColumn) => {
    socket.emit('task:move', { taskId, newColumn });
  };

  const deleteTask = (taskId) => {
    socket.emit('task:delete', taskId);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      moveTask,
      deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};