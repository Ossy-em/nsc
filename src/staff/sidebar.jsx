import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ departmentName, userData, pendingRequests = 0 }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
      >
        ☰
      </button>
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-gray-100 p-5 flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:w-64`}
      >
        <nav className="flex flex-col flex-grow space-y-4">
          <NavLink
            to={`/department/${departmentName}/${userData?.role === 'director' ? 'director' : 'staff-request'}`}
            className={({ isActive }) =>
              `block py-2 px-4 rounded hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
            onClick={() => setIsOpen(false)}
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
              `block py-2 px-4 rounded hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Request History
          </NavLink>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full block py-2 px-4 rounded hover:bg-gray-700 text-left"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
