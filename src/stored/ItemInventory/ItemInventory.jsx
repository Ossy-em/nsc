import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const ItemInventory = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "supplier_requests"));
      const itemsMap = {};

      querySnapshot.forEach((doc) => {
        const request = doc.data().items || [];

        request.forEach((item) => {
          const itemName = item.name.trim().toLowerCase();
          const formattedName = item.name.replace(/\b\w/g, (char) => char.toUpperCase());

          if (itemsMap[itemName]) {
            itemsMap[itemName].quantity += Number(item.quantity) || 0;
          } else {
            itemsMap[itemName] = {
              name: formattedName,
              quantity: Number(item.quantity) || 0,
            };
          }
        });
      });

      setItems(Object.values(itemsMap));
    };

    fetchItems();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Item Inventory</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Item Name</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">No items available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ItemInventory;
