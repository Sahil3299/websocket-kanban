import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/dashboard" className="nav-brand">
            📊 Kanban Board
          </Link>
          
          {user && (
            <div className="nav-links">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/board" className="nav-link">
                Board
              </Link>
              <Link to="/mytasks" className="nav-link">
                My Tasks
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="nav-link">
                  Admin Panel
                </Link>
              )}
            </div>
          )}
        </div>
        
        <div className="nav-right">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-auth-link">
                Login
              </Link>
              <Link to="/register" className="nav-auth-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;