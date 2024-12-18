
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const MainLayout = () => {
  return (
    <div className='pt-2'>
      <Navbar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout




