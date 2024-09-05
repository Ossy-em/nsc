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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar toggle

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar open/close state
  };

  return (
    <div className="admin-dashboard">
     
      <div className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className='dashboardsidebar-image'>
          <img src={NSCLogo} alt='image' style={{ width: '50px', height: '40px' }} />
          <h1>Admin</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#">View Requests</a></li>
            <li><a href="#">Add User</a></li>
            <li><a href="#">Status</a></li>
            <li><a href="#">History</a></li>
            <li><a href="#">Store</a></li>
            <li><a href="#">Dashboard</a></li>
          </ul>
        </nav>
        <button className="toggle-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className="dashboard-content">
       
        <section>
          <ViewRequests />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;

