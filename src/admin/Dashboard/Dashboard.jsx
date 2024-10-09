import React, { useState, useEffect } from 'react';
import { getRequestsForCurrentMonth, calculateTotalItemsForOverview, groupRequestsByFloorAndWeek } from '../ApexChart';
import Chart from 'react-apexcharts';
import { Box, Grid, Typography } from '@mui/material';
import './Dashboard.css';

const Dashboard = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const requests = await getRequestsForCurrentMonth();
      const total = calculateTotalItemsForOverview(requests);
      const groupedData = groupRequestsByFloorAndWeek(requests);

      setTotalItems(total);
      setChartData(groupedData);
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

  return (
    <div className="dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box
            className="overview-box"
            sx={{ backgroundColor: '#e3f2fd', padding: '20px' }}
            onClick={() => setShowChart(!showChart)}
          >
            <Typography variant="h6">Total Requests</Typography>
            <Typography variant="h4">{totalItems}</Typography>
            <Typography variant="subtitle1">
              Total number of items requested for the month of {new Date().toLocaleString('default', { month: 'long' })}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {showChart && (
        <div className="chart-container" style={{ marginTop: '30px' }}>
          <Chart options={options} series={series} type="bar" height={350} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
