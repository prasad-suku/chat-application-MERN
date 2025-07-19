import React, { useState } from 'react'
import Chatcontainer from "../Components/Chatcontainer"
import Sidebar from "../Components/Sidebar"
const Home = () => {
  const [isUserSelected,setUserselected] = useState(false)
//  console.log(isUserSelected);
 
  return (
    <div className='h-screen w-full text-white  sm:px-[2%] sm:py-[1%]'>
        {/* <div className='bg-gray-500 border h-full'> */}
       <div className='grid grid-cols-3  border-amber-50 overflow-hidden
backdrop-blur-xl   h-[100%] rounded-xl '>
        <Sidebar />
        <Chatcontainer />
       {/* </div> */}
       </div>
    </div>
  )
}

export default Home