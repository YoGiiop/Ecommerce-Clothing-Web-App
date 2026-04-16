import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../config/constants'
import axios from 'axios'
import { toast } from 'react-toastify'

const Lists = ({token}) => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if(response.data.success){
        setList(response.data.products)
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch (error) {
      // ...existing code...
      toast.error('Error fetching products')
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers: {Authorization: 'Bearer ' + token}})
      // ...existing code...
      if(response.data.success){
        toast.success('Product removed successfully')
        await fetchList()
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch (error) {
      // ...existing code...
      toast.error('Error removing product')
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='text-2xl font-medium mb-4 text-gray-700'>All Products List</p>
      <div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>

        {/* List Table Title  */}
        <div className='hidden md:grid md:grid-cols-[72px_minmax(0,3fr)_1fr_1fr_72px] items-center bg-gray-100 px-4 py-3 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* Product List */}
        {
          list.map((item, index) => (
            <div className='flex flex-col gap-3 border-t px-4 py-4 text-sm md:grid md:grid-cols-[72px_minmax(0,3fr)_1fr_1fr_72px] md:items-center md:gap-4' key={index}>
              <div className='flex items-start gap-3 md:contents'>
                <img className='h-14 w-14 rounded object-cover md:h-12 md:w-12' src={item.image[0]} alt={item.name} />
                <div className='min-w-0 flex-1 md:hidden'>
                  <p className='font-medium text-gray-800 break-words'>{item.name}</p>
                  <div className='mt-1 flex flex-wrap gap-x-4 gap-y-1 text-gray-500'>
                    <p>Category: {item.category}</p>
                    <p>Price: {currency}{item.price}</p>
                  </div>
                </div>
              </div>
              <p className='hidden md:block break-words'>{item.name}</p>
              <p className='hidden md:block'>{item.category}</p>
              <p className='hidden md:block'>{currency}{item.price}</p>
              <button onClick={() => removeProduct(item._id)} className='self-end text-right md:text-center cursor-pointer text-sm font-medium text-red-600 hover:text-red-700'>Remove</button>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Lists
