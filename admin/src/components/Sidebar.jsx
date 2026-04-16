import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-full border-b md:w-64 md:min-h-screen md:border-b-0 md:border-r-2'>
      <div className='flex gap-3 overflow-x-auto px-4 py-4 text-[15px] md:flex-col md:gap-4 md:px-6 md:pt-6'>

        <NavLink className={({ isActive }) => `flex min-w-fit items-center gap-3 px-3 py-2 border border-gray-300 rounded-md whitespace-nowrap ${isActive ? 'bg-[#ffebf5] border-[#c586a5]' : 'bg-white'}`} to="/add">
            <img className='w-5 h-5' src={assets.add_icon} alt="" />
            <p>ADD Items</p>
        </NavLink>
        <NavLink className={({ isActive }) => `flex min-w-fit items-center gap-3 px-3 py-2 border border-gray-300 rounded-md whitespace-nowrap ${isActive ? 'bg-[#ffebf5] border-[#c586a5]' : 'bg-white'}`} to="/list">
            <img className='w-5 h-5' src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink>
        <NavLink className={({ isActive }) => `flex min-w-fit items-center gap-3 px-3 py-2 border border-gray-300 rounded-md whitespace-nowrap ${isActive ? 'bg-[#ffebf5] border-[#c586a5]' : 'bg-white'}`} to="/orders">
            <img className='w-5 h-5' src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
