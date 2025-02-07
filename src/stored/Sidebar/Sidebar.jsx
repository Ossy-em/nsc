import React from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import StoreDashboard from "../StoreDashboard/StoreDashboard";
import SupplierRequests from "../SupplierRequests/SupplierRequests";
import ItemInventory from "../ItemInventory/ItemInventory";
import History from "../History/History";
import SupplierForm from "../SupplierForm/SupplierForm";
import "./sidebar.css";
import NSCLogo from "/Users/mac/Desktop/nsc/src/assets/NSCLogo.png";
const Store = () => {
  return (
    <div className="store">
      <div className=".store-sidebar">
        <div className="dashboard-sidebar">
          <div className="dashboardsidebar-image">
            <img
              src={NSCLogo}
              alt="Admin Logo"
              style={{ width: "72px", height: "63px" }}
            />
            <h1>STORE</h1>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink to="/store-dashboard" activeClassName="active">
                  Store Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/store-dashboard/supplier-requests">
                  Supplier Requests
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/store-dashboard/item-inventory"
                  activeClassName="active"
                >
                  Item Inventory
                </NavLink>
              </li>
              <li>
                <NavLink to="/store-dashboard/history" activeClassName="active">
                  History
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/store-dashboard/store-form"
                  activeClassName="active"
                >
                  Supplier form
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
     
      </div>
      <div className="dashboard-content">
          <Routes>
            <Route path="/store-dashboard" element={<StoreDashboard />} />
            <Route path="/supplier-requests" element={<SupplierRequests />} />
            <Route path="/item-inventory" element={<ItemInventory />} />
            <Route path="/history" element={<History />} />
            <Route path="store-form" element={<SupplierForm />} />
            <Route path="/" element={<Navigate to="/store-dashboard" />} />
          </Routes>
        </div>
    </div>
  );
};

export default Store;
