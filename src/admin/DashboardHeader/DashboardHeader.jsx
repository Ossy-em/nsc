import React, { useState } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import ViewRequests from '../View Request/Viewrequest';
import Store from '../Store/Stored';
import History from '../History/History';
import Dashboard from '../Dashboard/Dashboard';
import Status from '../Status/Status';
import NSCLogo from '/Users/mac/Desktop/nsc/src/assets/NSCLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './DashboardHeader.css';


const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <div className='dashboardsidebar-image'>
         
          <h1>Admin</h1>
          <img src={NSCLogo} alt='Admin Logo' style={{ width: '72px', height: '63px' }} />
        </div>
        <nav>
          <ul>
            <li><NavLink to="/admin-dashboard/view-requests">View Requests</NavLink></li>
            <li><NavLink to="/admin-dashboard/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/admin-dashboard/status">Status</NavLink></li>
            <li><NavLink to="/admin-dashboard/history">History</NavLink></li>
            <li><NavLink to="/admin-dashboard/store">Store</NavLink></li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <Routes>
          <Route path="view-requests" element={<ViewRequests />} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="status" element={<Status />} />
          <Route path="history" element={<History />} />
          <Route path="store" element={<Store />} />
          <Route path="/" element={<ViewRequests />} /> {/* Default home page */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;