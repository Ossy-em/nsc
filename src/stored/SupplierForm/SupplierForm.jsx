import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { db } from "../../utils/firebase"; // Import your Firestore config
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
} from "firebase/firestore";

const SupplierForm = () => {
  const [supplierDetails, setSupplierDetails] = useState({
    name: "",
    contact: "",
    address: "",
    suppliersCompany: "hsjds"
  });
  const [items, setItems] = useState([
    { itemName: "", quantity: "1", price: "", model: "jja", notes: "",  },
  ]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierDetails({ ...supplierDetails, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];

    if (name === "price") {
      const formattedValue = value.replace(/,/g, "");
      if (!isNaN(formattedValue)) {
        updatedItems[index][name] = Number(formattedValue).toLocaleString(); // Format with commas
      }
    } else {
      updatedItems[index][name] = value;
    }

    setItems(updatedItems);
  };

  const addNewItem = () => {
    setItems([
      ...items,
      { itemName: "", quantity: "", price: "", model: "", notes: "" },
    ]);
  };

  const resetForm = () => {
    setSupplierDetails({ name: "", contact: "", address: "",  suppliersCompany: "" });
    setItems([
      { itemName: "", quantity: "1", price: "", model: "jja", notes: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get current date and time
      const now = new Date();
      const date = now.toISOString().split("T")[0]; // Extract the date (YYYY-MM-DD)
      const time = now.toTimeString().split(" ")[0]; // Extract the time (HH:MM:SS)
  
      // Prepare supplier details with separate date and time
      const supplierDetailsWithDate = {
        ...supplierDetails,
        date, // Add date field
        time, // Add time field
      };
  
      // Add supplier details to Firestore
      const supplierRef = await addDoc(collection(db, "supplier_requests"), {
        ...supplierDetailsWithDate,
        items,
      });
  
      // Add or update inventory items
      for (const item of items) {
        const itemRef = doc(db, "inventory", item.itemName);
        const itemDoc = await getDoc(itemRef);
        if (itemDoc.exists()) {
          // Update existing item quantity
          await updateDoc(itemRef, {
            quantity: increment(Number(item.quantity)),
          });
        } else {
          // Add new item to inventory
          await setDoc(itemRef, {
            name: item.itemName,
            quantity: Number(item.quantity),
            price: Number(item.price.replace(/,/g, "")), // Convert formatted price to number
            model: item.model,
            notes: item.notes,
          });
        }
      }
  
      setSnackbar({
        open: true,
        message: "Supplier and inventory updated successfully!",
        severity: "success",
      });
  
      // Reset form after submission
      resetForm();
    } catch (error) {
      console.error("Error adding supplier or items: ", error);
      setSnackbar({
        open: true,
        message: "Failed to update supplier or inventory.",
        severity: "error",
      });
    }
  };
  

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Supplier
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Supplier Name"
              name="name"
              value={supplierDetails.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact"
              name="contact"
              value={supplierDetails.contact}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Supplier's Company"
              name="suppliersCompany"
              value={supplierDetails.suppliersCompany}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={supplierDetails.address}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Items Supplied</Typography>
          </Grid>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Item Name"
                  name="itemName"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Price"
                  name="price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Model Name"
                  name="model"
                  value={item.model}
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Note"
                  name="notes"
                  value={item.notes}
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                />
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button variant="outlined" onClick={addNewItem}>
              Add Another Item
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupplierForm;
