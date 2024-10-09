import React, { useState, useEffect } from 'react';
import { getRequestsForCurrentMonth, calculateTotalItemsForOverview, groupRequestsByFloorAndWeek, getAcceptedRequests } from '../ApexChart';
import Chart from 'react-apexcharts';
import './Dashboard.css';
import { IoClose } from 'react-icons/io5'; 

const Dashboard = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [chartData, setChartData] = useState({});
  const [acceptedItems, setAcceptedItems] = useState(0);
  const [acceptedChartData, setAcceptedChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleChart, setVisibleChart] = useState(null); // For tracking which chart is visible

  useEffect(() => {
    const fetchData = async () => {
      const requests = await getRequestsForCurrentMonth();
      const acceptedRequests = await getAcceptedRequests();
      
      const total = calculateTotalItemsForOverview(requests);
      const acceptedTotal = calculateTotalItemsForOverview(acceptedRequests);
      
      const groupedData = groupRequestsByFloorAndWeek(requests);
      const groupedAcceptedData = groupRequestsByFloorAndWeek(acceptedRequests);

      setTotalItems(total);
      setAcceptedItems(acceptedTotal);
      setChartData(groupedData);
      setAcceptedChartData(groupedAcceptedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  // Prepare data for ApexCharts
  const floors = Object.keys(chartData);
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  const series = weeks.map((week, weekIndex) => ({
    name: week,
    data: floors.map((floor) => chartData[floor][`Week${weekIndex + 1}`] || 0),
  }));

  const acceptedSeries = weeks.map((week, weekIndex) => ({
    name: week,
    data: floors.map((floor) => acceptedChartData[floor][`Week${weekIndex + 1}`] || 0),
  }));

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
    },
    xaxis: {
      categories: floors,
      title: {
        text: 'Floor',
      },
    },
    yaxis: {
      title: {
        text: 'Total Items Requested',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val} items requested`,
      },
    },
    title: {
      text: 'Total Items Requested by Floor and Week',
    },
    legend: {
      position: 'top',
    },
  };

  const acceptedOptions = {
    ...options,
    title: {
      text: 'Accepted Requests by Floor and Week',
    },
  };

  // Function to toggle between charts and ensure only one is visible
  const handleChartToggle = (chart) => {
    setVisibleChart((prevChart) => (prevChart === chart ? null : chart)); // If the clicked chart is already showing, close it
  };

  // Function to close any chart
  const closeChart = () => setVisibleChart(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard-overview">
        <div className="overview total-requests" onClick={() => handleChartToggle('totalRequests')}>
          <h6>Total Requests</h6>
          <p>{new Date().toLocaleString('default', { month: 'long' })}</p>
          <h4>{totalItems}</h4>
        </div>

        <div className="overview accepted-requests" onClick={() => handleChartToggle('acceptedRequests')}>
          <h6>Accepted Requests</h6>
          <p>{new Date().toLocaleString('default', { month: 'long' })}</p>
          <h4>{acceptedItems}</h4>
        </div>
      </div>

      <div className="chart-section">
        {visibleChart === 'totalRequests' && (
          <div className="chart-container">
            <button className="close-chart-btn" onClick={closeChart}>
              <IoClose size={24} />
            </button>
            <Chart options={options} series={series} type="bar" height={350} />
          </div>
        )}

        {visibleChart === 'acceptedRequests' && (
          <div className="chart-container">
            <button className="close-chart-btn" onClick={closeChart}>
              <IoClose size={24} />
            </button>
            <Chart options={acceptedOptions} series={acceptedSeries} type="bar" height={350} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
