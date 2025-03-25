import React, { useState } from 'react';
import Select from 'react-select';

const StaffForm = ({ onSubmit, departmentName }) => {
  // Staff personal information
  const [staffInfo, setStaffInfo] = useState({
    name: 'ossy',
    email: 'emosinachi@gmail.com',
    position: 'program anaylst'
  });

  // Selected items list with quantity
  const [selectedItems, setSelectedItems] = useState([
    { id: Date.now(), item: null, quantity: 1 }
  ]);

  // Purpose of request
  const [purpose, setPurpose] = useState('need soon, sir');
  
  // Request urgency
  const [urgency, setUrgency] = useState('normal');

  // Available ICT devices/items
  const itemOptions = [
    { value: 'desktop', label: 'Desktop Computer' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'printer', label: 'Printer' },
    { value: 'scanner', label: 'Scanner' },
    { value: 'projector', label: 'Projector' },
    { value: 'monitor', label: 'Monitor' },
    { value: 'keyboard', label: 'Keyboard' },
    { value: 'mouse', label: 'Mouse' },
    { value: 'usbDrive', label: 'USB Drive' }
  ];

  // Handle staff info change
  const handleStaffInfoChange = (e) => {
    const { name, value } = e.target;
    setStaffInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new item row
  const handleAddItem = () => {
    setSelectedItems(prev => [
      ...prev,
      { id: Date.now(), item: null, quantity: 1 }
    ]);
  };

  // Remove item row
  const handleRemoveItem = (id) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  // Handle item selection change
  const handleItemChange = (id, selectedOption) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, item: selectedOption } : item
      )
    );
  };

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value) || 1;
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create submission data
    const formData = {
      staffInfo: {
        ...staffInfo,
        department: departmentName // Use the department from props
      },
      items: selectedItems.map(({ item, quantity }) => ({
        item: item?.value,
        itemName: item?.label,
        quantity
      })),
      purpose,
      urgency,
      timestamp: new Date().toISOString()
    };
    
    // Send data to parent component
    onSubmit(formData);
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '0.375rem',
      borderColor: '#d1d5db',
      minHeight: '42px',
      '&:hover': {
        borderColor: '#9ca3af',
      },
    }),
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Staff Request Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={staffInfo.name}
                onChange={handleStaffInfoChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={staffInfo.email}
                onChange={handleStaffInfoChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position/Role *
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={staffInfo.position}
              onChange={handleStaffInfoChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            Department: <span className="font-medium">{departmentName}</span>
          </div>
        </div>
        
        {/* Item Request Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Item Request</h3>
          
          <div className="space-y-3">
            {selectedItems.map((itemRow) => (
              <div key={itemRow.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 bg-white rounded border border-gray-200">
                <div className="w-full md:w-3/5">
                  <Select
                    options={itemOptions}
                    value={itemRow.item}
                    onChange={(option) => handleItemChange(itemRow.id, option)}
                    placeholder="Select an item"
                    styles={selectStyles}
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="w-full md:w-1/5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={itemRow.quantity}
                    onChange={(e) => handleQuantityChange(itemRow.id, e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={() => handleRemoveItem(itemRow.id)}
                  disabled={selectedItems.length <= 1}
                  className={`w-full md:w-auto mt-2 md:mt-0 px-3 py-2 rounded-md ${
                    selectedItems.length <= 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <button 
            type="button" 
            onClick={handleAddItem}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Item
          </button>
        </div>
        
        {/* Purpose and Urgency Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Request Details</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Request *
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Please explain why you need these items..."
              required
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value="low"
                  checked={urgency === 'low'}
                  onChange={() => setUrgency('low')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Low Priority</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value="normal"
                  checked={urgency === 'normal'}
                  onChange={() => setUrgency('normal')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Normal</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value="high"
                  checked={urgency === 'high'}
                  onChange={() => setUrgency('high')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">High Priority</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value="urgent"
                  checked={urgency === 'urgent'}
                  onChange={() => setUrgency('urgent')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Urgent</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;