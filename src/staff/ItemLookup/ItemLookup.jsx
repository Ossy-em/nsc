import React, { useState } from 'react';
import Select from 'react-select';
import './ItemLookup.css';

const itemOptions = [
  { value: 'laserJetToner', label: 'Laser Jet Toner' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'printer', label: 'Printer' },
  // Add more items here
];

const TableBasedSelection = () => {
  const [rows, setRows] = useState([{ item: null, quantity: 1 }]);
  const [purpose, setPurpose] = useState('');
  const [purposes, setPurposes] = useState([]);

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

  // purpose submission
  const handleSubmitPurpose = (event) => {
    event.preventDefault();
    if (purpose.trim() === '') return;

    setPurposes([...purposes, purpose]);
    setPurpose(''); 
  };

  return (
    <div className='Item-Request'>
      <h2>Item Request</h2>
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
                <button onClick={() => handleRemoveRow(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow}>Add Row</button>

      
      <div className="purpose-section">
        <h2>Purpose:</h2>
        <form onSubmit={handleSubmitPurpose}>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Write the purpose here"
          ></textarea>
         
        </form>
    
      </div>
      <button className='btn-submit' type="submit">Submit</button>
    </div>
  );
};

export default TableBasedSelection;
