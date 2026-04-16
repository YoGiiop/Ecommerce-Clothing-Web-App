import React from 'react'
import {assets} from '../assets/assets.js'

const Navbar = ({setToken}) => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken('')
  }

  return (
    <div className='flex items-center px-4 sm:px-[4%] py-3 justify-between gap-4'>
      <img className='w-24 sm:w-28' src={assets.logo} alt="" />
      <button onClick={handleLogout} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar
