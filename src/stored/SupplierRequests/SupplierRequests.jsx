import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import "./SupplierRequest.css";
import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import { color } from "framer-motion";

const SupplierRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const columns = [
    { field: "name", headerName: "Supplier Name", width: 195 },
    { field: "company", headerName: "Supplier's Company", width: 195 },
    { field: "contact", headerName: "Contact", width: 110 },
    { field: "itemName", headerName: "Item Name", width: 145 },
    { field: "model", headerName: "Model", width: 100 },
    { field: "quantity", headerName: "Qty", width: 50 },
    { field: "date", headerName: "Date/Time", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setSelectedRequest(params.row);
            setOpenDialog(true);
          }}
        >
          View More
        </Button>
      ),
    },
  ];

  const fetchSupplierRequests = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "supplier_requests"));
      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        const firstItem = docData.items?.[0] || {}; // Ensure firstItem exists

        return {
          id: doc.id,
          name: docData.name || "N/A",
          company: docData.suppliersCompany || "N/A",
          address: docData.address || "N/A",
          contact: docData.contact || "N/A",
          itemName: firstItem.itemName || "N/A",
          model: firstItem.model || "N/A",
          quantity: firstItem.quantity || 0,
          price: firstItem.price || 0,
          note: firstItem.note || "No Notes",
          date: docData.date || "N/A",
        };
      });
      setRequests(data);
    } catch (error) {
      console.error("Error fetching supplier requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierRequests();
  }, []);

  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="SupplierRequests" sx={{ tableLayout: "fixed", width: "91%" }} style={{ height: 500, width: "91%" }}>
      {loading ? (
        <p>Loading supplier requests...</p>
      ) : (
        <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
          <input
            type="text"
            placeholder="Search by Supplier Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <div style={{ width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={filteredRequests}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            sx={{
              tableLayout: "fixed",
              width: "100%",
              overflow: "hidden",
              '& .MuiDataGrid-cell': {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
          </div>
        </div>
      )}

      <Dialog
        open={openDialog}
        onClose={() => {
          setSelectedRequest(null);
          setOpenDialog(false);
        }}
      >
        <div className="Modal">
        <DialogTitle>Supplier Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <div>
              <p>
                <strong>Name:</strong> {selectedRequest.name}
              </p>
              <p>
                <strong>Company:</strong> {selectedRequest.company}
              </p>
              <p>
                <strong>Contact:</strong> {selectedRequest.contact}
              </p>
              <p>
                <strong>Item:</strong> {selectedRequest.itemName}
              </p>
              <p>
                <strong>Model:</strong> {selectedRequest.model}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedRequest.quantity}
              </p>
              <p>
                <strong>Date:</strong> {selectedRequest.date}
              </p>
              <button className="DialogContent-btn" >Close</button>
            </div>
          )}
        </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default SupplierRequests;
