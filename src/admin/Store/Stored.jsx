import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import './Store.css';

const Store = () => {
  const [storeItems, setStoreItems] = useState([]);
  const [newItemName, setNewItemName] = useState(
    {
      brand:'',
      productType:'',
      modelNumber:'',
      series:'',
      color:'',
      quantity:'',
    }
  );
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStoreItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'store'));
        const itemsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStoreItems(itemsData);
        setFilteredItems(itemsData); // Set initial state
      } catch (error) {
        console.error('Error fetching store items:', error);
      }
    };

    fetchStoreItems();
  }, []);

  // Function to handle search input changes
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = storeItems.filter(item =>
      item.name.toLowerCase().includes(value) ||
      item.model.toLowerCase().includes(value)
    );
    setFilteredItems(filtered);
  };

  return (
    <div className="store-container">
      <h1>Store Items</h1>
      <input
        type="text"
        placeholder="Search by name or model"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>Device</th>
            <th>Model</th>
            <th>Quantity Available</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.model}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Store;
