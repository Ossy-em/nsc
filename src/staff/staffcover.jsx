import React from 'react'
import CompanyName from './CompanyName/CompanyName'
import StaffForm from './StaffForm/StaffForm'
import ItemLookup from './ItemLookup/ItemLookup'
import './StaffCover.css'

const staffcover = () => {
  return (
    <div className='staff-cover'>
      <CompanyName/>
      <StaffForm/>
      <ItemLookup/>
    </div>
  )
}

export default staffcover
