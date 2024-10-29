import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ItemUsageChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const usageData = {};

      const querySnapshot = await getDocs(collection(db, 'totalrequests'));
      querySnapshot.forEach((doc) => {
        const { items, staffInfo } = doc.data();
        const week = getRequestWeek(doc.data().timestamp); // Helper to calculate the week
        const floor = staffInfo.employeeFloor;

        items.forEach(({ item: { label }, quantity }) => {
          // Initialize structure if not already existing
          if (!usageData[label]) usageData[label] = {};
          if (!usageData[label][floor]) usageData[label][floor] = Array(5).fill(0);

          // Aggregate quantities per week per floor
          usageData[label][floor][week] += quantity;
        });
      });

      setChartData({
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: Object.keys(usageData).flatMap((item, itemIdx) =>
          Object.keys(usageData[item]).map((floor, floorIdx) => ({
            label: `${item} (Floor ${floor})`, // Show item and floor in the label
            data: usageData[item][floor],
            backgroundColor: `rgba(${50 + itemIdx * 40}, ${80 + floorIdx * 20}, 132, 0.2)`,
            borderColor: `rgba(${50 + itemIdx * 40}, ${80 + floorIdx * 20}, 132, 1)`,
            borderWidth: 1,
          }))
        ),
      });
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const itemName = context.dataset.label.split(' (')[0]; // Extract item name from label
                    const quantity = context.raw; // Access the quantity
                    return `${itemName}: ${quantity} items requested`;
                  },
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ItemUsageChart;

// Helper function to calculate the week of a request
const getRequestWeek = (timestamp) => {
  const requestDate = new Date(timestamp);
  const startOfMonth = new Date(requestDate.getFullYear(), requestDate.getMonth(), 1);
  return Math.floor((requestDate - startOfMonth) / (7 * 24 * 60 * 60 * 1000));
};
