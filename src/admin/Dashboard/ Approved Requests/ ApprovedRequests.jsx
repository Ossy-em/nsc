import React, { useState, useEffect } from 'react';
import { getApprovedRequests, calculateTotalApprovedItems, groupApprovedRequestsByFloorAndWeek } from "../ApexChart";
import Chart from 'react-apexcharts';
import { Box, Typography } from '@mui/material';
import '../Dashboard.css';

const ApprovedRequests = () => {
  const [totalApprovedItems, setTotalApprovedItems] = useState(0);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const approvedRequests = await getApprovedRequests();
      const totalApproved = calculateTotalApprovedItems(approvedRequests);
      const groupedData = groupApprovedRequestsByFloorAndWeek(approvedRequests);

      setTotalApprovedItems(totalApproved);
      setChartData(groupedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

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
        text: 'Approved Items',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val} approved items`,
      },
    },
    title: {
      text: 'Approved Items by Floor and Week',
    },
    legend: {
      position: 'top',
    },
  };

  return (
    <div>
      <Box
        className="overview-box"
        sx={{ backgroundColor: '#e8f5e9', padding: '20px' }}
        onClick={() => setShowChart(!showChart)}
      >
        <Typography className='overview-h6' variant="h6">Approved Requests</Typography>
        <Typography className='subtitle1' variant="subtitle1">
          {new Date().toLocaleString('default', { month: 'long' })}
          <Typography className='overview-h4' variant="h4">{totalApprovedItems}</Typography>
        </Typography>
      </Box>

      {showChart && (
        <div className="chart-container" style={{ marginTop: '30px' }}>
          <Chart options={options} series={series} type="bar" height={350} />
        </div>
      )}
    </div>
  );
};

export default ApprovedRequests;
