import React, { useContext, useEffect, useRef, useState } from 'react'
import { formatTime } from '../utils/FormatTime'
import assets, { messagesDummyData } from "../assets/assets"
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/Authcontext'
import toast from 'react-hot-toast'

const Chatcontainer = () => {
  
  const {selectedUser, sendMessage, messages, getMessages} = useContext(ChatContext)
  const {authUser, onlineUser} = useContext(AuthContext)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  
  // handleSendMessage function
  const handleSendMessage = async(e) => {
    e.preventDefault()
    if(input.trim() === "") return
     
    await sendMessage({text: input.trim()})
    setInput("")
  }

  // handle sending an image fn
  const handleSendImg = async(e) => {
    const file = e.target.files[0]
    if(!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return;
    } 
    const reader = new FileReader()
    reader.onloadend = async() => {
      const baseimg = reader.result
      await sendMessage({image: baseimg})
      // make sure to reset the file input as empty 
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }
  
  useEffect(() => {
    if(selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])
  
  // Improved auto scroll to the bottom of chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (messages && messages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 100)
    }
  }, [messages])

  return (      
    selectedUser ? (   
      <div className='h-screen col-span-3 relative backdrop-blur-lg'>
        {/* header */}
        <div className='flex items-center px-5 py-3 gap-2 border-b border-gray-300'>
          <img src={selectedUser?.profilePicture || assets.profile_martin} alt="user-prof" className='w-9 rounded-full' />
          <div className='text-lg flex items-center gap-2'>
            {selectedUser.fullName}
            {onlineUser?.includes(selectedUser._id) ? <div className='w-2 h-2 bg-blue-500 rounded-full'></div> : null}  
          </div>
        </div>

        {/* chat area with proper scroll container */}
        <div 
          ref={chatContainerRef}
          className='flex flex-col overflow-y-auto overflow-x-hidden h-[calc(100vh-200px)] p-3 pb-6 scroll-smooth'
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages && messages.length > 0 && messages.map((mes, i) => {
            // Safety check to ensure mes exists and has required properties
            if (!mes || (!mes.text && !mes.image)) return null;
            
            // Check if this message is from the current user
            const isMyMessage = mes.senderId === authUser?._id;
            
            return (
              <div key={i} className={`flex items-end gap-2 mb-4 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
              
                 {/* message time */}
                <div className='text-center text-xs sm:text-sm'>
                  <img 
                    src={isMyMessage 
                      ? (authUser?.profilePicture || assets.avatar_icon)
                      : (selectedUser?.profilePicture || assets.avatar_icon)
                    } 
                    alt="user-image" 
                    className='w-6 rounded-full' 
                  />
                  <p className='font-normal text-xs'>{formatTime(mes.createdAt)}</p>
                </div>

                {mes.image ? (
                  <img src={mes.image} className='max-w-30 md:max-w-50 mb-3 rounded-lg' alt="message-image" />
                ) : (
                  <p className={`p-2 max-w-[200px] md:text-xl text-xs font-light rounded-lg break-all ${
                    isMyMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  }`}>
                    {mes.text}
                  </p>
                )}
              </div>
            )
          })}
          {/* Invisible element to mark the end of messages */}
          <div ref={messagesEndRef} />
        </div>

        {/* input area */}
        <div className='absolute bottom-18 left-0 right-0 flex items-center md:gap-3 gap-1'>
          <div className='flex-1 flex items-center px-1 bg-gray-100/20 rounded-full'>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} 
              placeholder='Send a message' 
              className='flex-1 border-none outline-none text-white p-1 md:p-3 placeholder-gray-400 bg-transparent'  
            />
            <input 
              type="file" 
              onChange={(e) => handleSendImg(e)} 
              id='image' 
              accept='image/png, image/jpeg' 
              hidden
            />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="gallery-icon" className='md:w-4 w-3 mr-2 cursor-pointer' />
            </label>
          </div>
          <img 
            src={assets.send_button} 
            onClick={(e) => handleSendMessage(e)} 
            alt="send-icon" 
            className='md:w-9 w-6 mr-3 cursor-pointer' 
          />
        </div>
      </div>
    ) : (
      <div className='flex flex-col item-start h-screen col-span-3 sm:col-span-3 justify-center gap-2 text-gray-500 bg-white/10'>
        <img src={assets.logo_icon} className='max-w-16 sm:max-w-30 mx-auto' alt="logo" />
        <p className='text-lg font-medium text-center text-white'>Chat anytime, anywhere</p>
      </div>
    )
  )
}

export default Chatcontainer