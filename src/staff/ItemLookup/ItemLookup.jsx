import React, { useState } from 'react';
import Select from 'react-select';

const StaffForm = ({ onSubmit, departmentName }) => {
  // Staff personal information
  const [staffInfo, setStaffInfo] = useState({
    name: 'ossy',
    email: 'emosinachi@gmail.com',
    position: 'program anaylst',
  });

  const [selectedItems, setSelectedItems] = useState([
    { id: Date.now(), item: null, quantity: 1 },
  ]);

  const [purpose, setPurpose] = useState('need soon, sir');
  const [urgency, setUrgency] = useState('normal');

  const itemOptions = [
    { value: 'desktop', label: 'Desktop Computer' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'printer', label: 'Printer' },
    { value: 'scanner', label: 'Scanner' },
    { value: 'projector', label: 'Projector' },
    { value: 'monitor', label: 'Monitor' },
    { value: 'keyboard', label: 'Keyboard' },
    { value: 'mouse', label: 'Mouse' },
    { value: 'usbDrive', label: 'USB Drive' },
  ];

  const handleStaffInfoChange = (e) => {
    const { name, value } = e.target;
    setStaffInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    setSelectedItems((prev) => [
      ...prev,
      { id: Date.now(), item: null, quantity: 1 },
    ]);
  };

  const handleRemoveItem = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, selectedOption) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, item: selectedOption } : item
      )
    );
  };

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value) || 1;
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      staffInfo: {
        ...staffInfo,
        department: departmentName,
      },
      items: selectedItems.map(({ item, quantity }) => ({
        item: item?.value,
        itemName: item?.label,
        quantity,
      })),
      purpose,
      urgency,
      timestamp: new Date().toISOString(),
    };

    onSubmit(formData);
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '0.375rem',
      borderColor: '#d1d5db',
      minHeight: '2.5rem', // Responsive height
      fontSize: '0.875rem', // Matches text-sm
      '&:hover': {
        borderColor: '#9ca3af',
      },
    }),
    menu: (base) => ({
      ...base,
      fontSize: '0.875rem',
    }),
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Staff Request Form</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
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
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            Department: <span className="font-medium">{departmentName}</span>
          </div>
        </div>

        {/* Item Request */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Item Request</h3>

          <div className="space-y-4">
            {selectedItems.map((itemRow) => (
              <div
                key={itemRow.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white rounded border border-gray-200"
              >
                <div className="w-full sm:flex-1">
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

                <div className="w-full sm:w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={itemRow.quantity}
                    onChange={(e) => handleQuantityChange(itemRow.id, e.target.value)}
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(itemRow.id)}
                  disabled={selectedItems.length <= 1}
                  className={`w-full sm:w-24 mt-2 sm:mt-0 px-3 py-2.5 rounded-md text-sm ${
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
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Item
          </button>
        </div>

        {/* Purpose and Urgency Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Request Details</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Request *
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Please explain why you need these items..."
              required
              rows="4"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['low', 'normal', 'high', 'urgent'].map((level) => (
                <label key={level} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={urgency === level}
                    onChange={() => setUrgency(level)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;