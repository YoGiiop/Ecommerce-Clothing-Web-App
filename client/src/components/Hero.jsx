import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-300'>
      {/* Hero Left Side */}
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 px-6 sm:px-8 lg:px-12">
        <div className='text-[#414141] text-center sm:text-left'>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-xs sm:text-sm md:text-base'>OUR BESTSELLERS</p>
            </div>
          <h1 className='text-2xl sm:text-3xl sm:py-3 lg:text-5xl leading-snug sm:leading-relaxed'>Latest Arrivals</h1>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <p className='font-semibold text-sm md:text-base'>Shop Now</p>
                <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <img src={assets.hero_img} className="w-full sm:w-1/2 object-cover" alt="Hero" />
    </div>
  )
}

export default Hero
