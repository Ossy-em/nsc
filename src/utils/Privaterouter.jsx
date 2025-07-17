import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './PrivateRoute.css';

const PrivateRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    try {
      const userData = sessionStorage.getItem('user');
      console.log('PrivateRoute checking session:', userData); 
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setAuthError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="div-loader"><span className="loader"></span></div>;
  }

  if (authError) {
    console.error('Authentication error:', authError);
    return (
      <div className="error-message">
        <p>Error: {authError.message}</p>
        <Navigate to="/" />
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to /'); 
    return <Navigate to="/" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log(`Role mismatch: ${user.role} !== ${requiredRole}, redirecting to /`); 
    return <Navigate to="/" />;
  }

  console.log('PrivateRoute passed, rendering children'); 
  return children;
};

export default PrivateRoute;