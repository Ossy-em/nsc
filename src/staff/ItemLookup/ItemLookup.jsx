import React, { useState } from 'react';
import Select from 'react-select';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase'; // Update with your correct path to firebase
import './ItemLookup.css';
import StaffForm from '../StaffForm/StaffForm';

const itemOptions = [
  { value: 'laserJetToner', label: 'Laser Jet Toner' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'printer', label: 'Printer' },
  { value: 'scanner', label: 'Scanner' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'monitor', label: 'Monitor' },
];

const TableBasedSelection = () => {
  const [rows, setRows] = useState([{ item: null, quantity: 1 }]);
  const [purpose, setPurpose] = useState('');
  const [staffFormData, setStaffFormData] = useState({});

  const handleAddRow = () => {
    setRows([...rows, { item: null, quantity: 1 }]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleItemChange = (index, selectedItem) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, item: selectedItem } : row
    );
    setRows(updatedRows);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, quantity } : row
    );
    setRows(updatedRows);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      staffInfo: staffFormData,
      items: rows,
      purpose,
      timestamp: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'requests'), requestData);
      console.log('Request submitted with ID: ', docRef.id);
      // Optionally reset form state here
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div>
      <StaffForm onFormChange={setStaffFormData} />
      <div className="Item-Request">
        <h2>Item Request</h2>
        <form onSubmit={handleSubmit}>
          <table>
            <thead>
              <tr>
                <th>Item Required</th>
                <th>Quantity Required</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <Select
                      options={itemOptions}
                      value={row.item}
                      onChange={(selectedItem) => handleItemChange(index, selectedItem)}
                      placeholder="Select an item"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                      min="1"
                      placeholder="Quantity"
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => handleRemoveRow(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={handleAddRow}>Add Row</button>

          <div className="purpose-section">
            <h2>Purpose:</h2>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Write the purpose here"
            ></textarea>
          </div>
          <button className="btn-submit" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TableBasedSelection;
