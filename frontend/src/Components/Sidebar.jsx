import React, { useContext, useEffect, useState } from 'react'
import assets from "../assets/assets"
import axios from "axios"
import { AuthContext } from '../../context/Authcontext'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../../context/ChatContext'
const Sidebar = () => {
   
 const {selectedUser,users,setSelectedUser,
  getUsers,unseenMessages,setUnseenMessages}=  useContext(ChatContext)

  const {logout,onlineUser} = useContext(AuthContext)
  console.log("onlineuser",onlineUser);
  
  const [input,setInput] = useState("")
  
  // filtered users based on search input
   const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users 

  const navigateToProfile = useNavigate()
 

  useEffect(()=>{
     getUsers()
  },[onlineUser])

  return (
    <div>
        <div className="pb-5 px-4 py-5 overflow-y-scroll text-white ">
            <div className="flex justify-between items-center">
                <img src={assets.logo} alt="logo" className='max-w-15' />
                <span className='font-bold text-xl text-white'>Quick chat</span>
                <div className="relative py-2 group">
                     <img src={assets.menu_icon} alt="menu-icon" className='max-h-5 cursor-pointer' />
                     <div className='absolute top-5  right-1  w-32 p-5 rounded-md bg-gray-800 text-white border border-gray-600  hidden group-hover:block'>
                      <p onClick={()=>navigateToProfile("/profile")} className='text-sm cursor-pointer hover:text-gray-500'>Edit Profile</p>
                       <hr className='my-2 border-t border-gray-500'/>
                       <p onClick={()=>logout()} className='text-sm cursor-pointer  hover:text-gray-500'>Logout</p>
                     </div>
                </div>
            </div>

            {/* search bar */}
            <div className='flex items-center gap-2 rounded-full mt-5 pr-4 mr-4 bg-gray-700 '>
          <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} className='bg-transparent border-none px-8 py-2 outline-none text-white text-md w-full ' placeholder="Search User"/>
          <img src={assets.search_icon} alt="search-icon" className='max-w-5' />
            </div>

         {/* users */}

         <div className='flex flex-col mt-5 gap-3  overflow-y-scroll h-[100vh]'>
           {
            filteredUsers?.map((user,ind)=>{
              return (
                <>
                <div key={ind} className='flex items-center gap-5' >
                  <img src={user?.profilePicture || assets.avatar_icon} alt="user-prof" className='max-w-12 rounded-full' />
                   <div className='flex flex-col'>
                    <p>{user.fullName}</p>
                    {onlineUser?.includes(user._id) ? <span className='text-green-400 text-xs'>Online</span>:<span className='text-gray-400 text-xs'>Offline</span>}
                   </div>
                   {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
                </div>
                </>
              )
            })
           }
            
            
            
            
         </div>
           
        </div>
    </div>
  )
}

export default Sidebar