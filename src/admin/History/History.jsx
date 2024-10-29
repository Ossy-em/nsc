import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './History.css';

const History = () => {
  const [historyRequests, setHistoryRequests] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchHistoryRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'history'));
        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistoryRequests(historyData);
      } catch (error) {
        console.error('Error fetching history requests:', error);
      }
    };

    fetchHistoryRequests();
  }, []);

  // Map and flatten data for DataGrid rows
  useEffect(() => {
    const formattedRows = historyRequests.map((request) => ({
      id: request.id,
      firstName: request.staffInfo?.firstName || 'N/A',
      lastName: request.staffInfo?.lastName || 'N/A',
      department: request.staffInfo?.department || 'N/A',
      itemsRequested: request.items || [],
      status: request.status || 'No status',
      processedAt: request.processedAt ? new Date(request.processedAt).toLocaleString() : 'N/A',
    }));
    setRows(formattedRows);
  }, [historyRequests]);

  // Define columns for DataGrid
  const columns = [
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'department', headerName: 'Department', width: 180 },
    {
      field: 'itemsRequested',
      headerName: 'Items Requested',
      width: 300,
      renderCell: (params) => (
        <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          {params.value.map((item, index) => (
            <li key={index}>
              {item.item.label} (Qty: {item.quantity})
            </li>
          ))}
        </ul>
      ),
    },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'processedAt', headerName: 'Processed At', width: 200 },
  ];

  // Function to export table as PDF
  const exportPDF = async () => {
    const pdf = new jsPDF();
    const dataGridElement = document.getElementById('dataGrid');

    // Temporarily set the width to full content width to capture all columns
    const originalWidth = dataGridElement.style.width;
    dataGridElement.style.width = "auto";

    await html2canvas(dataGridElement, {
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      useCORS: true,  // To enable cross-origin images, if any
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // Width of the image in the PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Reset the width to its original value after capturing
      dataGridElement.style.width = originalWidth;

      pdf.save('Request_History.pdf');
    });
  };

  return (
    <div style={{ width: "800px", height: "fit-content", maxWidth: "100%", overflow: "hidden" }}>
      <h2>Request History</h2>
      <button onClick={exportPDF} style={{ justifyContent: "left", marginBottom: "15px", padding: "8px 16px", backgroundColor: "#3f51b5", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Download PDF
      </button>
      <div id="dataGrid">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
        />
      </div>
    </div>
  );
};

export default History;
