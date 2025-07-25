import React, { useState } from 'react'
import Chatcontainer from "../Components/Chatcontainer"
import Sidebar from "../Components/Sidebar"
const Home = () => {


 
  return (
    <div className='h-screen w-full text-white  sm:px-[2%]  py-[2%]'>
        {/* <div className='bg-gray-500 border h-full'> */}
       <div className='grid grid-cols-5  border-amber-50 overflow-hidden
backdrop-blur-xl   h-[100%] rounded-xl '>
        <Sidebar />
        <Chatcontainer />
       {/* </div> */}
       </div>
    </div>
  )
}

export default Home