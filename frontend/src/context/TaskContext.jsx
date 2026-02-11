import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSocket, disconnectSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, getToken } = useAuth();

  useEffect(() => {
    if (user) {
      const token = getToken();
      const socketInstance = getSocket(token);
      setSocket(socketInstance);

      // Update connection status
      setIsConnected(socketInstance?.connected || false);
      
      socketInstance?.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });
      
      socketInstance?.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      // Listen for task updates
      socketInstance?.on('sync:tasks', (initialTasks) => {
        setTasks(initialTasks);
      });

      socketInstance?.on('task:created', (newTask) => {
        setTasks(prev => [...prev, newTask]);
      });

      socketInstance?.on('task:updated', (updatedTask) => {
        setTasks(prev => prev.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
      });

      socketInstance?.on('task:moved', (movedTask) => {
        setTasks(prev => prev.map(task => 
          task.id === movedTask.id ? movedTask : task
        ));
      });

      socketInstance?.on('task:deleted', (taskId) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      });

      return () => {
        if (socketInstance) {
          socketInstance.off('connect');
          socketInstance.off('disconnect');
          socketInstance.off('sync:tasks');
          socketInstance.off('task:created');
          socketInstance.off('task:updated');
          socketInstance.off('task:moved');
          socketInstance.off('task:deleted');
        }
      };
    } else {
      if (socket) {
        disconnectSocket();
        setSocket(null);
      }
      setTasks([]);
      setIsConnected(false);
    }
  }, [user]);

  const addTask = (taskData) => {
    if (socket) {
      socket.emit('task:create', taskData);
    } else {
      console.error('Socket not connected');
    }
  };

  const updateTask = (taskId, updates) => {
    if (socket) {
      socket.emit('task:update', { id: taskId, ...updates });
    } else {
      console.error('Socket not connected');
    }
  };

  const moveTask = (taskId, newColumn) => {
    if (socket) {
      socket.emit('task:move', { taskId, newColumn });
    } else {
      console.error('Socket not connected');
    }
  };

  const deleteTask = (taskId) => {
    if (socket) {
      socket.emit('task:delete', taskId);
    } else {
      console.error('Socket not connected');
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      moveTask,
      deleteTask,
      socket,
      isConnected
    }}>
      {children}
    </TaskContext.Provider>
  );
};