import React, { useState } from 'react';
import Select from 'react-select';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
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

const ItemRequestForm = () => {
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
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div>
      <StaffForm onFormChange={setStaffFormData} />
      <div className="item-request-form">
        <h2 className="item-request-title">Item Request</h2>
        <form className="item-request-table-form" onSubmit={handleSubmit}>
          <table className="item-request-table">
            <thead className="item-request-table-head">
              <tr className="item-request-table-row">
                <th className="item-request-table-header">Item Required</th>
                <th className="item-request-table-header">Quantity Required</th>
                <th className="item-request-table-header">Action</th>
              </tr>
            </thead>
            <tbody className="item-request-table-body">
              {rows.map((row, index) => (
                <tr key={index} className="item-request-table-row">
                  <td className="item-request-table-cell">
                    <Select
                      options={itemOptions}
                      value={row.item}
                      onChange={(selectedItem) => handleItemChange(index, selectedItem)}
                      placeholder="Select an item"
                    />
                  </td>
                  <td className="item-request-table-cell">
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                      min="1"
                      placeholder="Quantity"
                    />
                  </td>
                  <td className="item-request-table-cell">
                    <button
                      className="item-request-remove-button"
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="item-request-add-button" type="button" onClick={handleAddRow}>
            Add Row
          </button>

          <div className="item-request-purpose-section">
            <h2 className="item-request-purpose-title">Purpose:</h2>
            <textarea
              className="item-request-purpose-textarea"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Write the purpose here"
            ></textarea>
          </div>
          <button className="item-request-submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemRequestForm;
