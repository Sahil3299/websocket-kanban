import React, { useContext, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import '../styles/MyTasks.css';

const MyTasks = () => {
  const { user } = useAuth();
  const { tasks, updateTask, deleteTask } = useContext(TaskContext);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  // Filter tasks assigned to current user or created by current user
  const myTasks = tasks.filter(task => 
    task.assignee === user?.name || task.userId === user?.id
  );

  // Apply filters
  const filteredTasks = myTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'todo') return task.column === 'todo';
    if (filter === 'inprogress') return task.column === 'inprogress';
    if (filter === 'done') return task.column === 'done';
    if (filter === 'high') return task.priority === 'high';
    if (filter === 'medium') return task.priority === 'medium';
    if (filter === 'low') return task.priority === 'low';
    return true;
  });

  // Apply sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Calculate statistics
  const stats = {
    total: myTasks.length,
    todo: myTasks.filter(t => t.column === 'todo').length,
    inprogress: myTasks.filter(t => t.column === 'inprogress').length,
    done: myTasks.filter(t => t.column === 'done').length,
    high: myTasks.filter(t => t.priority === 'high').length,
    medium: myTasks.filter(t => t.priority === 'medium').length,
    low: myTasks.filter(t => t.priority === 'low').length,
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = { high: '#f44336', medium: '#ff9800', low: '#4caf50' };
    return colors[priority] || '#666';
  };

  // Get column label
  const getColumnLabel = (column) => {
    const labels = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };
    return labels[column] || column;
  };

  // Handle task move
  const handleMoveTask = (taskId, newColumn) => {
    updateTask(taskId, { column: newColumn });
  };

  // Handle task delete
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  // Handle priority change
  const handlePriorityChange = (taskId, newPriority) => {
    updateTask(taskId, { priority: newPriority });
  };

  if (!user) {
    return (
      <div className="my-tasks-container">
        <div className="my-tasks-header">
          <h2>My Tasks</h2>
          <p>Please log in to view your tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-tasks-container">
      <div className="my-tasks-header">
        <div className="header-left">
          <h2>📋 My Tasks</h2>
          <p className="welcome-text">
            Welcome back, <span className="user-name">{user.name}</span>! 
            Here are all your assigned tasks.
          </p>
        </div>
        <div className="header-right">
          <div className="task-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.todo}</span>
              <span className="stat-label">To Do</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.inprogress}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.done}</span>
              <span className="stat-label">Done</span>
            </div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by:</label>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button 
              className={`filter-btn ${filter === 'todo' ? 'active' : ''}`}
              onClick={() => setFilter('todo')}
            >
              To Do ({stats.todo})
            </button>
            <button 
              className={`filter-btn ${filter === 'inprogress' ? 'active' : ''}`}
              onClick={() => setFilter('inprogress')}
            >
              In Progress ({stats.inprogress})
            </button>
            <button 
              className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
              onClick={() => setFilter('done')}
            >
              Done ({stats.done})
            </button>
            <button 
              className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
              onClick={() => setFilter('high')}
            >
              High Priority ({stats.high})
            </button>
          </div>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Newest First</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="title">Title (A to Z)</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="empty-tasks">
          <div className="empty-icon">📭</div>
          <h3>No tasks found</h3>
          <p>You don't have any tasks assigned to you yet.</p>
          <p>Create a new task or ask someone to assign you one!</p>
        </div>
      ) : (
        <>
          <div className="tasks-summary">
            <p>
              Showing <strong>{sortedTasks.length}</strong> of <strong>{myTasks.length}</strong> tasks
              {filter !== 'all' && ` (filtered by ${filter})`}
            </p>
          </div>

          <div className="tasks-grid">
            {sortedTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <div className="task-title-section">
                    <h4 className="task-title">{task.title}</h4>
                    {task.userId === user.id && (
                      <span className="task-creator-badge">Created by me</span>
                    )}
                  </div>
                  <div className="task-actions">
                    <select
                      className="priority-select"
                      value={task.priority}
                      onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                      style={{ 
                        backgroundColor: getPriorityColor(task.priority),
                        color: 'white'
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <p className="task-description">{task.description || 'No description'}</p>

                <div className="task-meta">
                  <div className="task-column">
                    <span className="meta-label">Status:</span>
                    <span className={`column-badge column-${task.column}`}>
                      {getColumnLabel(task.column)}
                    </span>
                  </div>
                  
                  <div className="task-priority-display">
                    <span className="meta-label">Priority:</span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="task-categories">
                  <span className="task-category">
                    {task.category === 'bug' && '🐛 Bug'}
                    {task.category === 'feature' && '✨ Feature'}
                    {task.category === 'enhancement' && '🔧 Enhancement'}
                  </span>
                  {task.attachments && task.attachments.length > 0 && (
                    <span className="attachment-count">
                      📎 {task.attachments.length}
                    </span>
                  )}
                </div>

                <div className="task-dates">
                  <small>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </small>
                </div>

                <div className="task-move-actions">
                  <span className="move-label">Move to:</span>
                  <div className="move-buttons">
                    <button 
                      className={`move-btn ${task.column === 'todo' ? 'active' : ''}`}
                      onClick={() => handleMoveTask(task.id, 'todo')}
                      disabled={task.column === 'todo'}
                    >
                      To Do
                    </button>
                    <button 
                      className={`move-btn ${task.column === 'inprogress' ? 'active' : ''}`}
                      onClick={() => handleMoveTask(task.id, 'inprogress')}
                      disabled={task.column === 'inprogress'}
                    >
                      In Progress
                    </button>
                    <button 
                      className={`move-btn ${task.column === 'done' ? 'active' : ''}`}
                      onClick={() => handleMoveTask(task.id, 'done')}
                      disabled={task.column === 'done'}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="tasks-insights">
            <h3>📊 Task Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <div className="insight-content">
                  <h4>Completion Rate</h4>
                  <p className="insight-value">
                    {stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%
                  </p>
                  <p className="insight-desc">
                    {stats.done} of {stats.total} tasks completed
                  </p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-icon">⚠️</div>
                <div className="insight-content">
                  <h4>High Priority</h4>
                  <p className="insight-value">{stats.high}</p>
                  <p className="insight-desc">
                    Urgent tasks need attention
                  </p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-icon">⏳</div>
                <div className="insight-content">
                  <h4>In Progress</h4>
                  <p className="insight-value">{stats.inprogress}</p>
                  <p className="insight-desc">
                    Tasks currently being worked on
                  </p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-icon">📅</div>
                <div className="insight-content">
                  <h4>Pending</h4>
                  <p className="insight-value">{stats.todo}</p>
                  <p className="insight-desc">
                    Tasks waiting to start
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyTasks;