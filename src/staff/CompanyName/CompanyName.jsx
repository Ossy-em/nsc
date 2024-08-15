import React from 'react'
import './companyname.css'
import NSCLogo from '/Users/mac/Desktop/nsc/src/assets/NSCLogo.png'


const CompanyName = () => {
  return (
    <div className='CompanyName'>
   <div className='images'>  
    
     <img src={NSCLogo} alt='image' style={{ width: '180px', height: '150px' }}/>
   
   </div>
      {/* <h3>Nigeria Shippers Council</h3> */}
      
    </div>
  )
}

export default CompanyName

