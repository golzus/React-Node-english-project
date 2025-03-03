import React from 'react'
import Navbar from '../../navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../footer/Footer'
import "./dash-dashLayout.css"
import SitdeBar from '../../sitdebar/Sitdebar'
const DashLayout = () => {
  return (
    <div className='container'>
      {/* <div className='mane'>
       <SitdeBar />
      </div> */}
      <div className='content'>
        <Navbar className="nav" />
        <Outlet className="outlet"/>
        {/* <Footer className="footer" /> */}
      </div>
    </div>
  )
}

export default DashLayout
