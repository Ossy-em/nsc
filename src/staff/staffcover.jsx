import React from 'react'
import CompanyName from './CompanyName/CompanyName'
import ItemLookup from './ItemLookup/ItemLookup'
import Header from './Header/Header'
import './StaffCover.css'

const staffcover = () => {
  return (
    <div className='staff-cover'>
      <Header/>
      <CompanyName/>
      <ItemLookup/>
    </div>
  )
}

export default staffcover
