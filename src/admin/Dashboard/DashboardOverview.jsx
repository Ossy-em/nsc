// src/admin/DashboardOverview.js
import React, { useState } from 'react';
import RequestChartModal from './RequestChartModal';

const DashboardOverview = ({ requests, departments }) => {
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalRequests = requests.filter(req => 
    req.status === 'approved' && 
    req.createdAt?.seconds && 
    new Date(req.createdAt.seconds * 1000) >= monthStart
  ).length;

  const pendingRequests = totalRequests; // Same as Total for now

  const approvedRequests = requests.filter(req => 
    req.status === 'admin_approved' && 
    req.createdAt?.seconds && 
    new Date(req.createdAt.seconds * 1000) >= monthStart
  ).length;

  console.log('DashboardOverview - Total:', totalRequests, 'Pending:', pendingRequests, 'Approved:', approvedRequests);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
          onClick={() => setShowTotalModal(true)}
        >
          <h2 className="text-lg font-semibold text-gray-700">Total Director-Approved Requests</h2>
          <p className="text-3xl font-bold text-gray-800">{totalRequests}</p>
        </div>
        <div
          className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100" // Synced classes
          onClick={() => {
            console.log('Pending box clicked');
            setShowPendingModal(true);
          }}
        >
          <h2 className="text-lg font-semibold text-gray-700">Pending Requests</h2>
          <p className="text-3xl font-bold text-orange-600">{pendingRequests}</p>
        </div>
        <div
          className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100" // Synced classes
          onClick={() => {
            console.log('Approved box clicked');
            setShowApprovedModal(true);
          }}
        >
          <h2 className="text-lg font-semibold text-gray-700">Approved Requests</h2>
          <p className="text-3xl font-bold text-green-600">{approvedRequests}</p>
        </div>
      </div>

      <RequestChartModal
        isOpen={showTotalModal}
        onClose={() => setShowTotalModal(false)}
        requests={requests}
        departments={departments}
        title="Total Director-Approved Requests by Department (This Month)"
        statusFilter="approved"
      />
      <RequestChartModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        requests={requests}
        departments={departments}
        title="Pending Requests by Department (This Month)"
        statusFilter="approved"
      />
      <RequestChartModal
        isOpen={showApprovedModal}
        onClose={() => setShowApprovedModal(false)}
        requests={requests}
        departments={departments}
        title="ICT Admin-Approved Requests by Department (This Month)"
        statusFilter="admin_approved"
      />
    </>
  );
};

export default DashboardOverview;