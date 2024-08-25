import React, { useState } from 'react';
import StaffLoginPage from './StaffLoginPage/StaffLoginPage';
import AdminLoginPage from './AdminLoginPage/AdminLoginPage';
import './LoginPage.css';

const LoginPage = () => {
  const [view, setView] = useState('staff'); // Default to 'staff' view

  const handleStaffClick = () => {
    setView('staff');
  };

  const handleAdminClick = () => {
    setView('admin');
  };

  return (
    <div className="login-container">
      <div className="staff-admin-con">
        <button
          className={view === 'staff' ? 'active' : ''}
          onClick={handleStaffClick}
        >
          Staff
        </button>
        <button
          className={view === 'admin' ? 'active' : ''}
          onClick={handleAdminClick}
        >
          Admin
        </button>
      </div>
      {view === 'staff' && <StaffLoginPage />}
      {view === 'admin' && <AdminLoginPage />}
    </div>
  );
};

export default LoginPage;
