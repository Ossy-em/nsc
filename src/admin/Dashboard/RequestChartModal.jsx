// src/admin/RequestChartModal.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const RequestChartModal = ({ isOpen, onClose, requests, departments, title, statusFilter }) => {
  if (!isOpen) return null;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const filteredRequests = requests.filter(req => 
    req.status === statusFilter && 
    req.createdAt?.seconds && 
    new Date(req.createdAt.seconds * 1000) >= monthStart
  );

  console.log(`${title} - Filtered requests:`, filteredRequests);

  const deptCounts = filteredRequests.reduce((acc, req) => {
    const deptId = req.departmentId || 'Unknown';
    const deptName = departments[deptId] || deptId;
    acc[deptName] = (acc[deptName] || 0) + 1;
    return acc;
  }, {});

  console.log(`${title} - Dept counts:`, deptCounts);

  const chartData = {
    labels: Object.keys(deptCounts).length ? Object.keys(deptCounts) : ['No Data'],
    datasets: [{
      label: title.split(' by ')[0],
      data: Object.keys(deptCounts).length ? Object.values(deptCounts) : [0],
      backgroundColor: statusFilter === 'approved' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(76, 175, 80, 0.6)',
      borderColor: statusFilter === 'approved' ? 'rgba(54, 162, 235, 1)' : 'rgba(76, 175, 80, 1)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Requests' } },
      x: { title: { display: true, text: 'Departments' } },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <Bar data={chartData} options={chartOptions} />
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RequestChartModal;