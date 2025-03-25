import React from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import StoreDashboard from "../StoreDashboard/StoreDashboard";
import SupplierRequests from "../SupplierRequests/SupplierRequests";
import ItemInventory from "../ItemInventory/ItemInventory";
import History from "../History/History";
import SupplierForm from "../SupplierForm/SupplierForm";
import Notification from "../Notification";
import Logout from "../../login/Logout"; // Import Logout component
import NSCLogo from "/Users/mac/Desktop/nsc/src/assets/NSCLogo.png";

const StoreSidebar = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ccddd3] via-[#d4e8dd] to-[#f2faf5] p-5">
      <div className="flex bg-gradient-to-br from-[#ccddd3] via-[#d4e8dd] to-[#f2faf5] min-h-screen rounded-xl shadow-lg p-6">
        {/* Sidebar */}
        <div className="w-64 bg-transparent p-5 flex flex-col relative">
          {/* Logo & Store Title */}
          <div className="flex items-center gap-3">
            <img src={NSCLogo} alt="Store Logo" className="w-18 h-16" />
            <h1 className="text-lg font-bold">Store</h1>
          </div>
          {/* Navigation Links */}
          <nav className="mt-12 flex flex-col flex-grow">
            <ul className="space-y-5">
              <li>
                <NavLink
                  to="/store-dashboard"
                  className="block py-2 px-4 rounded-lg text-green-700 hover:bg-green-100 transition"
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/store-dashboard/supplier-requests"
                  className="block py-2 px-4 rounded-lg text-green-700 hover:bg-green-100 transition"
                >
                  Supplier Requests
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/store-dashboard/item-inventory"
                  className="block py-2 px-4 rounded-lg text-green-700 hover:bg-green-100 transition"
                >
                  Item Inventory
                </NavLink>
              </li>
            
              <li>
                <NavLink
                  to="/store-dashboard/store-form"
                  className="block py-2 px-4 rounded-lg text-green-700 hover:bg-green-100 transition"
                >
                  Supplier Form
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/store-dashboard/notification"
                  className="block py-2 px-4 rounded-lg text-green-700 hover:bg-green-100 transition"
                >
                  Notification
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/store-dashboard/history"
                  className="block py-2 px-4 rounded-lg text-green-700 hover:bg-green-100 transition"
                >
                  History
                </NavLink>
              </li>
            </ul>
          </nav>
          {/* Logout Button */}
          <div className="absolute bottom-6 w-full">
            <Logout />
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/store-dashboard" element={<StoreDashboard />} />
            <Route path="/supplier-requests" element={<SupplierRequests />} />
            <Route path="/item-inventory" element={<ItemInventory />} />
            
            <Route path="/store-form" element={<SupplierForm />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/history" element={<History />} />
            <Route path="/" element={<Navigate to="/store-dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StoreSidebar;
