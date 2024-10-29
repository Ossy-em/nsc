import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Box,
  Button,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { collection, getDoc, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../utils/firebase"; // Firebase setup

const Table = ({ data }) => {
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [requestDetails, setRequestDetails] = useState({});
  const [adminComment, setAdminComment] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");

  useEffect(() => {
    setRows(data.map(item => ({
      id: item.id,
      firstName: item.staffInfo.firstName,
      lastName: item.staffInfo.lastName,
      department: item.staffInfo.department,
      itemsRequested: item.items || []
    })));
  }, [data]);

  const handleMenuClick = async (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);

    const requestDoc = await getDoc(doc(db, "requests", rowId));
    if (requestDoc.exists()) {
      const requestData = requestDoc.data();
      setRequestDetails(requestData);
      setEditedQuantity(requestData.quantity);
      setModalOpen(true);
    }

    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRowId(null);
  };

  const removeRequest = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleAction = async (action) => {
    const updatedRequest = {
      status: action === "accept" ? "Accepted" : "Declined",
      adminComment,
      items: requestDetails.items,
      processedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "history", selectedRowId), {
        ...requestDetails,
        ...updatedRequest, 
      });

      await deleteDoc(doc(db, "requests", selectedRowId));

      console.log(`Request ${action}ed successfully and moved to history.`);
      removeRequest(selectedRowId);
      setModalOpen(false);
    } catch (error) {
      console.error("Error processing the request: ", error);
    }
  };

  const columns = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    {
      field: "itemsRequested",
      headerName: "Items Requested",
      flex: 2,
      renderCell: (params) => {
        const items = params.value && Array.isArray(params.value) ? params.value : [];
        return (
          <div className="items-container">
            {items.map((item, index) => (
              <div key={index} className="item">
                {item?.item?.label || "Unknown item"} ({item?.quantity || "Unknown quantity"})
              </div>
            ))}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={(event) => handleMenuClick(event, params.row.id)}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ width: "800px", height: "100%", maxWidth: "100%", overflow: "hidden" }}>
      <DataGrid
        sx={{
          "& .MuiDataGrid-root": {
            maxWidth: "1000px",
            maxHeight: "90vh",
            minHeight: "70vh",
            width: "100%",
          },
        }}
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        autoHeight={false}
        getRowHeight={() => "auto"}
        pageSize={10}
      />

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            width: 400,
            p: 4,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
            borderRadius: "10px",
          }}
        >
          <h2>Request Details</h2>
          <div>
            <p><strong>Name:</strong> {requestDetails.staffInfo?.firstName} {requestDetails.staffInfo?.lastName}</p>
            <p><strong>Department:</strong> {requestDetails.staffInfo?.department}</p>
            <p><strong>Purpose:</strong> {requestDetails.purpose}</p>
            <p><strong>Floor:</strong> {requestDetails.staffInfo?.employeeFloor}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {requestDetails.items?.map((item, index) => (
                <li key={index}>
                  {item.item?.label || item.item} 
                  (Qty: 
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => setEditedQuantity(e.target.value)}
                    style={{ width: '60px', marginLeft: '5px' }}
                  />)
                </li>
              ))}
            </ul>
          </div>

          <TextField
            label="Admin Comment"
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <Button onClick={() => handleAction("accept")} variant="contained" color="primary" sx={{ mr: 2 }}>
            Accept
          </Button>
          <Button onClick={() => handleAction("decline")} variant="contained" color="secondary">
            Decline
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Table;
