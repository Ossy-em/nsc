
import { useState, useEffect, useCallback } from "react";
import { getDocs, collection, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { TextField, Button, Snackbar, Grid } from "@mui/material";

const SuppliersForm = () => {
  const [suppliers, setSuppliers] = useState({ name: "", contact: "", company: "", address: "" });
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState([{ name: "", quantity: "", price: "", model: "", note: "" }]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  const inventoryCollection = collection(db, "inventory");
  const suppliersRequestCollection = collection(db, "supplier_requests");

  const fetchInventory = useCallback(async () => {
    const data = await getDocs(inventoryCollection);
    setInventory(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const formatItemName = (name = "") => {
    return name.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleAddNewItem = async (index) => {
    const formattedName = formatItemName(newItem[index].name);
    if (!formattedName || inventory.some((item) => item.name?.toLowerCase() === formattedName.toLowerCase())) return;

    try {
      const docRef = await addDoc(inventoryCollection, { name: formattedName });
      setInventory([...inventory, { id: docRef.id, name: formattedName }]);
      setNewItem((prev) => prev.map((item, i) => (i === index ? { ...item, name: formattedName } : item)));
      setSnackbarMessage(`New item "${formattedName}" added successfully!`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleAddItemRow = () => {
    setNewItem([...newItem, { name: "", quantity: "", price: "", model: "", note: "" }]);
  };

  const handleChange = (index, field, value) => {
    setNewItem((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async () => {
    if (!suppliers.name || !suppliers.contact || !suppliers.company || !suppliers.address) {
      setSnackbarMessage("Please fill all fields");
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const supplierRequestSnapshot = await getDocs(suppliersRequestCollection);
      let existingData = null;
      let existingDocRef = null;
  
      // Check if a supplier request already exists
      supplierRequestSnapshot.forEach((doc) => {
        existingData = doc.data();
        existingDocRef = doc.ref;
      });
  
      if (existingData) {
        // If it exists, update item quantities
        const updatedItems = [...existingData.items];
  
        newItem.forEach((newEntry) => {
          const formattedName = formatItemName(newEntry.name);
          const existingItemIndex = updatedItems.findIndex(
            (item) => item.name.toLowerCase() === formattedName.toLowerCase()
          );
  
          if (existingItemIndex !== -1) {
            // If item exists, update quantity
            updatedItems[existingItemIndex].quantity =
              Number(updatedItems[existingItemIndex].quantity) + Number(newEntry.quantity);
          } else {
            // If item doesn't exist, add it
            updatedItems.push(newEntry);
          }
        });
  
        // Update the Firestore document
        await updateDoc(existingDocRef, { items: updatedItems });
      } else {
        // If no existing supplier request, create a new one
        await addDoc(suppliersRequestCollection, {
          supplier: suppliers,
          items: newItem,
          timestamp: new Date(),
        });
      }
  
      setSnackbarMessage("Supplier form submitted successfully!");
      setSnackbarOpen(true);
      setSuppliers({ name: "", contact: "", company: "", address: "" });
      setNewItem([{ name: "", quantity: "", price: "", model: "", note: "" }]);
  
      fetchInventory(); // Refresh inventory after update
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const handleRemoveLastItem = () => {
    setNewItem((prev) => prev.slice(0, -1)); // Removes the last item in the array
  };

  
  

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Supplier Details</h2>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField fullWidth required label="Supplier Name" value={suppliers.name} onChange={(e) => setSuppliers({ ...suppliers, name: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
          <TextField type="number" fullWidth required label="Contact" value={suppliers.contact} onChange={(e) => setSuppliers({ ...suppliers, contact: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth required label="Company" value={suppliers.company} onChange={(e) => setSuppliers({ ...suppliers, company: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth required label="Address" value={suppliers.address} onChange={(e) => setSuppliers({ ...suppliers, address: e.target.value })} />
        </Grid>
      </Grid>

      <h2 className="text-xl font-bold mt-6 mb-2">Items Supplied</h2>

      {newItem.map((item, index) => {
        const normalizedSearch = formatItemName(item.name || "");
        const filteredInventory = item.name
          ? inventory.filter((inv) => inv.name?.toLowerCase().startsWith(item.name?.toLowerCase() || ""))
          : [];
        const itemExists = inventory.some((inv) => inv.name?.toLowerCase() === normalizedSearch.toLowerCase());

        return (
          <Grid container spacing={2} key={index} className="mb-3">
            <Grid item xs={6}>
              <TextField fullWidth required label="Item Name" value={item.name} onChange={(e) => handleChange(index, "name", e.target.value)} />
              {filteredInventory.length > 0 && (
                <ul className="border rounded p-2 mt-1 bg-gray-100">
                  {filteredInventory.map((inv) => (
                    <li key={inv.id} className="p-1 cursor-pointer" onClick={() => handleChange(index, "name", inv.name)}>
                      {inv.name}
                    </li>
                  ))}
                </ul>
              )}
              {normalizedSearch && !itemExists && (
                <Button fullWidth variant="contained" color="success" onClick={() => handleAddNewItem(index)}>
                  Add "{normalizedSearch}"
                </Button>
              )}
            </Grid>
            <Grid item xs={3}>
              <TextField type="number" fullWidth required label="Quantity" value={item.quantity} onChange={(e) => handleChange(index, "quantity", e.target.value)} />
            </Grid>
            <Grid item xs={3}>
              <TextField type="number"  fullWidth required label="Cost Per Qty" value={item.price} onChange={(e) => handleChange(index, "price", e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth required label="Model Name" value={item.model} onChange={(e) => handleChange(index, "model", e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Note" value={item.note} onChange={(e) => handleChange(index, "note", e.target.value)} />
            </Grid>
          </Grid>
        );
      })}

<Button fullWidth variant="contained" color="primary" onClick={handleAddItemRow} className="mt-2">
  Add Another Item
</Button>

{newItem.length > 1 && (
  <Button 
    fullWidth 
    variant="outlined" 
    color="error" 
    onClick={handleRemoveLastItem} 
    className="mt-2"
  >
    Remove Last Item
  </Button>
)}


      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />

      <Button fullWidth variant="contained" color="secondary" onClick={handleSubmit} className="mt-4">
        Submit Supplier Form
      </Button>
    </div>
  );
};

export default SuppliersForm;