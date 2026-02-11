import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/DashBoard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Manage your tasks efficiently with the Kanban board</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Task Management</h3>
            <p>Organize your work with drag & drop</p>
            <button 
              onClick={() => navigate('/board')}
              className="stat-action"
            >
              Go to Board →
            </button>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Team Collaboration</h3>
            <p>Real-time updates with your team</p>
            <button className="stat-action">
              Invite Team →
            </button>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Progress Tracking</h3>
            <p>Visualize your productivity</p>
             <button 
              onClick={() => navigate('/MyTasks')}
              className="stat-action"
            >
              Go to Progress →
            </button>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/board')}
            className="action-btn primary"
          >
            + Create New Task
          </button>
          <button className="action-btn secondary">
            Import Tasks
          </button>
          <button className="action-btn tertiary">
            Export Board
          </button>
        </div>
      </div>
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">✅</span>
            <div className="activity-details">
              <p>Task "Design Review" moved to Done</p>
              <span className="activity-time">2 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">➕</span>
            <div className="activity-details">
              <p>New task "Bug Fix" created</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">👤</span>
            <div className="activity-details">
              <p>You logged in from new device</p>
              <span className="activity-time">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;