import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, Typography } from "@mui/material";

const SupplierRequestsTable = () => {
  const [supplierRequests, setSupplierRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSupplierRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "supplier_requests"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSupplierRequests(data);
    };
    fetchSupplierRequests();
  }, []);

  const columns = [
    { field: "supplierName", headerName: "Supplier Name", flex: 1 },
    { field: "company", headerName: "Company", flex: 1 },
    { field: "item", headerName: "Item Name", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "viewMore",
      headerName: "View More",
      flex: 1,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleViewMore(params.row)}>
          View More
        </Button>
      ),
    },
  ];

  const handleViewMore = (row) => {
    setSelectedRequest(row);
    setModalOpen(true);
  };

  return (
    <div className="p-4  border-gray-200">
      <Typography variant="h5" gutterBottom>
        Supplier Requests
      </Typography>
      <DataGrid rows={supplierRequests.map((req) => req.items.map((item) => ({
        id: `${req.id}-${item.name}`,
        supplierName: req.supplier.name,
        company: req.supplier.company,
        item: item.name,
        quantity: item.quantity,
        date: new Date(req.timestamp.seconds * 1000).toLocaleDateString(),
        fullData: req,
      }))).flat()} columns={columns} autoHeight pageSize={5} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box className="p-4 bg-white shadow-lg rounded-md w-96 mx-auto mt-20">
          <Typography variant="h6">Supplier Details</Typography>
          {selectedRequest && (
            <div>
              <Typography><strong>Name:</strong> {selectedRequest.supplierName}</Typography>
              <Typography><strong>Company:</strong> {selectedRequest.company}</Typography>
              <Typography><strong>Item:</strong> {selectedRequest.item}</Typography>
              <Typography><strong>Quantity:</strong> {selectedRequest.quantity}</Typography>
              <Typography><strong>Date:</strong> {selectedRequest.date}</Typography>
            </div>
          )}
          <Button fullWidth variant="contained" color="secondary" onClick={() => setModalOpen(false)} className="mt-4">
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default SupplierRequestsTable;
