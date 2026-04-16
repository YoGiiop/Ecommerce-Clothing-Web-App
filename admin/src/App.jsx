import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Lists from './pages/Lists'
import Orders from './pages/Orders'
import Add from './pages/Add'
import Login from './components/Login'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('adminToken') ? localStorage.getItem('adminToken') : '')

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token)
    } else {
      localStorage.removeItem('adminToken')
    }
  }
  , [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ''  ? <Login setToken={setToken}/> :
      <>
        <Navbar setToken={setToken}/>
        <hr />
        <div className='flex w-full flex-col md:flex-row'>
          <Sidebar />
          <div className='w-full flex-1 px-4 sm:px-6 lg:px-10 my-6 md:my-8 text-gray-600 text-sm sm:text-base'>
            <Routes>
              <Route path="/add" element={<Add token={token}/>} />
              <Route path="/list" element={<Lists token={token}/>} />
              <Route path="/orders" element={<Orders token={token} setToken={setToken}/>} />
            </Routes>
          </div>
        </div>
      </>
      }
    </div>
  )
}

export default App
