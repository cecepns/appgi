import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('apgi_admin_token');
    
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    adminAPI.verifyToken()
      .then(() => {
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('apgi_admin_token');
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;