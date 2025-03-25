import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
 // Update with your logo path

const Sidebar = ({ departmentName, userData, pendingRequests = 0 }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout clicked, clearing sessionStorage');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-800 text-gray-100 p-5 flex flex-col">
      {/* Logo & Department Title */}
      {/* <div className="flex items-center gap-3 mb-12">
        <img src={Logo} alt="Logo" className="w-12 h-12" />
        <h1 className="text-lg font-bold">
          {userData?.departmentName || 'Department'}
        </h1>
      </div> */}

      {/* Navigation Links */}
      <nav className="flex flex-col flex-grow space-y-4">
        <NavLink
          to={`/department/${departmentName}/${userData?.role === 'director' ? 'director' : 'staff-request'}`}
          className={({ isActive }) =>
            `block py-2 px-4 rounded text-gray-100 hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`
          }
        >
          <div className="flex items-center gap-2">
            Home
            {userData?.role === 'director' && pendingRequests > 0 && (
              <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {pendingRequests}
              </span>
            )}
          </div>
        </NavLink>
        <NavLink
          to={`/department/${departmentName}/requests`}
          className={({ isActive }) =>
            `block py-2 px-4 rounded text-gray-100 hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`
          }
          onClick={() => console.log('Navigating to history, sessionStorage:', sessionStorage.getItem('user'))}
        >
          Request History
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full block py-2 px-4 rounded text-gray-100 hover:bg-gray-700 text-left"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;