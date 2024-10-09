import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material"; 
import MoreVertIcon from "@mui/icons-material/MoreVert"; 
import './table.css'

const Table = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleMenuClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleAccept = () => {
    console.log("Accepted", selectedRowId);
    handleMenuClose();
    // Add logic to accept the request
  };

  const handleDecline = () => {
    console.log("Declined", selectedRowId);
    handleMenuClose();
    // Add logic to decline the request
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
        console.log("Rendering items:", items);
        return (
          <ol>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={(event) => handleMenuClick(event, params.row.id)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl && selectedRowId === params.row.id)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleAccept}>Accept</MenuItem>
            <MenuItem onClick={handleDecline}>Decline</MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  const rows = data.map((item) => {
    // Check if item.items exists and is an array, and log it for debugging
    console.log("Processing row:", item);
    const items = item.items && Array.isArray(item.items) ? item.items : [];
    console.log("Items for this row:", items);

    return {
      id: item.id,
      firstName: item.staffInfo.firstName,
      lastName: item.staffInfo.lastName,
      department: item.staffInfo.department,
      itemsRequested: items.map((it) => `${it.item.label} (${it.quantity})`), // Build item descriptions
    };
  });

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        disableSelectionOnClick
      />
    </>
  );
};

export default Table;
