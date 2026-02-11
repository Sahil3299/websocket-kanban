import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;