import react from 'react'
import { useFormik } from 'formik'
import './StaffForm.css'


function StaffForm(){
  const formik = useFormik( {
      initialValues: {
        firstName: '',
        lastName: '',
        department: '',
        manager:'',
        employeeFloor: '',
        unit: ''

    }
  })



  return (
    <form className="request-form">
       <header className="header">
      <h2>Staff Hardware Request Form</h2>
    </header>
      <div className="form-group form-group-horizontal">
        <div className="form-field">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" placeholder="Enter First Name" required onChange={formik.handleChange} value={formik.values.firstName}/>
        </div>
        <div className="form-field">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" placeholder="Enter Last Name" required onChange={formik.handleChange} value={formik.values.lastName} />
        </div>
      </div>

      <div className="form-group form-group-horizontal">
        <div className="form-field">
          <label htmlFor="department">Department</label>
          <input type="text" id="department" name="department" placeholder="Enter Department" required onChange={formik.handleChange} value={formik.values.department} />
        </div>
        <div className="form-field">
          <label htmlFor="manager">Manager</label>
          <input type="text" id="manager" name="manager" placeholder="Enter Manager Name" required onChange={formik.handleChange} value={formik.values.manager} />
        </div>
      </div>

      <div className="form-group form-group-horizontal">
        <div className="form-field">
          <label htmlFor="employeeFloor">Employee Floor</label>
          <input type="text" id="employeeFloor" name="employeeFloor" placeholder="Enter Employee Floor" required onChange={formik.handleChange} value={formik.values.employeeFloor} />
        </div>
        <div className="form-field">
          <label htmlFor="unit">Unit</label>
          <input type="text" id="unit" name="unit" placeholder="Enter Unit" required onChange={formik.handleChange} value={formik.values.unit} />
        </div>
      </div>
      </form>
  )

}
export default StaffForm
