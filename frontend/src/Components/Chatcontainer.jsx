import React, { useEffect, useRef } from 'react'
import { formatTime } from '../utils/FormatTime'
import assets, { messagesDummyData } from "../assets/assets"
const Chatcontainer = ({isUserSelected}) => {
  const scrollEnd = useRef()

  useEffect(()=>{
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior:"smooth"})
    }
  },[])
  return (      
  isUserSelected?(   
        <div  className='h-full col-span-2 overflow-scroll  relative backdrop-blur-lg'>
           {/* header */}
           <div className='flex items-center px-5 py-3 gap-2 border-b border-gray-300'>
            <img src={assets.profile_martin} alt="user-prof" className='w-9 rounded-full' />
            <div className='text-lg flex items-center gap-2'>Martin Joshson <div className='w-2 h-2 bg-blue-500 rounded-full'></div></div>
           </div>
     

         {/*chat area  */}

         <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
           {messagesDummyData.map((mes,i)=>{
            return <div key={i} className={`flex items-center gap-2  ${mes.senderId!=='680f50e4f10f3cd28382ecf9'?'flex-row-reverse':''}`}>
              {mes.image? 
              (<img src={mes.image} className='max-w-50 mb-3 rounded-lg' />):(
                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-blue-500 text-white`}>
                 {mes.text}
                </p>
              )}

              <div className='text-center text-xs'>
                <img src={`${mes.senderId!=="680f50e4f10f3cd28382ecf9"?assets.avatar_icon:assets.profile_martin}`} alt="user-image" className='w-6 rounded-full' />
                <p className='font-normal'>{formatTime(mes.createdAt)}</p>
              </div>

            </div>
           })}
           <div ref={scrollEnd}></div>
         </div>
     
     {/* input area */}

     <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
      <div className='flex-1 flex items-center bg-gray-100/20 px-2 rounded-full'>
      <input type="text" placeholder='Send a message' className='flex-1 border-none outline-none text-white p-3 placeholder-gray-400'  />
      <input type="file" id='image' accept='image/png, image/jpeg' hidden/>
       <label htmlFor="image">
        <img src={assets.gallery_icon} alt="gallery-icon" className='w-5 mr-2 cursor-pointer' />
       </label>
      </div>
        <img src={assets.send_button} alt="send-icon" className='w-9 cursor-pointer' />
     </div>


        </div>
          
      ):(
        <div className='flex flex-col item-start h-screen col-span-2 justify-center gap-2  text-gray-500 bg-white/10'>
             <img src={assets.logo_icon} className='max-w-16 sm:max-w-30 mx-auto' alt="logo" />
             <p className='text-lg font-medium text-center text-white'>Chat anytime, anywhere</p>
        </div>
      )

  
  )
}

export default Chatcontainer