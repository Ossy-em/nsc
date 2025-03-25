import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import ViewRequests from "../View Request/Viewrequest";
import Store from '../Store/Stored';
import History from '../History/History';
import Dashboard from '../Dashboard/Dashboard';
// import Status from '../Status/Status';
import NSCLogo from '/Users/mac/Desktop/nsc/src/assets/NSCLogo.png';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false); 

  console.log('Rendering DashboardHeader, session:', sessionStorage.getItem('user'));

  const handleLogout = () => {
    console.log('Logout clicked, clearing sessionStorage');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
      
        <div className="flex items-center p-4 border-b border-gray-700">
          <img
            src={NSCLogo}
            alt="Admin Logo"
            className={`${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} mr-2`}
          />
          {!isCollapsed && <h1 className="text-xl font-bold">ICT Admin</h1>}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-4 text-gray-400 hover:text-white focus:outline-none"
        >
          {isCollapsed ? '>' : '<'}
        </button>

        {/* Nav Links */}
        <nav className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <NavLink
                to="/admin-dashboard/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3">🏠</span>
                {!isCollapsed && 'Dashboard'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/view-requests"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3">📋</span>
                {!isCollapsed && 'View Requests'}
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/admin-dashboard/status"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3">⏳</span>
                {!isCollapsed && 'Status'}
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/admin-dashboard/history"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3">📜</span>
                {!isCollapsed && 'History'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/store"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3">🏪</span>
                {!isCollapsed && 'Store'}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Routes>
          <Route path="view-requests" element={<ViewRequests />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path="status" element={<Status />} /> */}
          <Route path="history" element={<History />} />
          <Route path="store" element={<Store />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardHeader;