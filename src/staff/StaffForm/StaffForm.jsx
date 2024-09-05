import React from 'react';
import { useFormik } from 'formik';
import './StaffForm.css';

const departments = [
  'Regulatory Services',
  'Consumer Affairs',
  'Strategic Planning and Research',
  'Human Resource Management',
  'Inland Transport Services',
  'Legal Services',
  'Special Duties',
  'Finance and Accounts',
  'General Services'
];

const units = [
  'Anti-Corruption and Transparency',
  'Complaints',
  'Information & Communication Technology',
  'SERVICOM',
  'Procurement',
  'Internal Audit',
  'Public Relations',
  'Public Private Partnership (PPP)'
];

const floors = [
  'Ground Floor',
  'First Floor',
  'Second Floor',
  'Third Floor',
  'Fourth Floor',
  'Fifth Floor',
  'Sixth Floor',
  'Seventh Floor',
  'Eighth Floor',
  'Ninth Floor',
  'Tenth Floor',
  'Eleventh Floor'
];

function StaffForm({ onFormChange }) {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      department: '',
      manager: '',
      employeeFloor: '',
      unit: ''
    },
    onSubmit: () => {}, // No need to submit here
  });

  React.useEffect(() => {
    onFormChange(formik.values);
  }, [formik.values]);

  return (
    <form className="request-form">
      <header className="header">
        <h2>Staff Hardware Request Form</h2>
      </header>
      <div className="form-group form-group-horizontal">
        <div className="form-field">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter First Name"
            required
            onChange={formik.handleChange}
            value={formik.values.firstName}
          />
        </div>
        <div className="form-field">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter Last Name"
            required
            onChange={formik.handleChange}
            value={formik.values.lastName}
          />
        </div>
      </div>

      <div className="form-group form-group-horizontal">
        <div className="form-field">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            required
            onChange={formik.handleChange}
            value={formik.values.department}
          >
            <option value="" label="Select Department" />
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="manager">Manager</label>
          <input
            type="text"
            id="manager"
            name="manager"
            placeholder="Enter Manager Name"
            required
            onChange={formik.handleChange}
            value={formik.values.manager}
          />
        </div>
      </div>

      <div className="form-group form-group-horizontal">
        <div className="form-field">
          <label htmlFor="employeeFloor">Employee Floor</label>
          <select
            id="employeeFloor"
            name="employeeFloor"
            required
            onChange={formik.handleChange}
            value={formik.values.employeeFloor}
          >
            <option value="" label="Select Floor" />
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="unit">Unit</label>
          <select
            id="unit"
            name="unit"
            required
            onChange={formik.handleChange}
            value={formik.values.unit}
          >
            <option value="" label="Select Unit" />
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}

export default StaffForm;
