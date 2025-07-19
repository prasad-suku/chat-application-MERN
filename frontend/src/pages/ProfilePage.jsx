import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/Authcontext'

const ProfilePage = () => {
  const [selectedImg,setSelectedImg] = useState("")
  const[userName,setUsername]=useState("")
  const navigate = useNavigate()
  
  const {updateProfile,authUser} = useContext(AuthContext)

  // handleSave fn
  const handleSave  = async(event)=>{
   event.preventDefault()
   if(!selectedImg){
  await updateProfile({fullName:userName})
    navigate("/")
    return;
   }
  
    const reader = new FileReader()
    reader.readAsDataURL(selectedImg)
    reader.onload = async()=>{
      const imgbase= reader.result
     await updateProfile({profilePicture:imgbase,fullName:userName})
     navigate("/")
    }

  }
  return (

    <div className='min-h-screen flex items-center justify-center'>

      <div className='w-5/6 max-w-[70%] p-4 backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max:flex-col-reverse rounded-lg'>
        {/* left */}
         <form  onSubmit={handleSave} className='flex flex-col gap-5 p-10 ' >
            <h1 className='font-bold text-3xl'>Profile details</h1>
            <label htmlFor="profile" className='flex items-center gap-2'>
              <input type="file" id='profile' accept='.png,.jpg,.jpeg' onChange={(e)=>setSelectedImg(e.target.files[0])} hidden />
           <img src={selectedImg?URL.createObjectURL(selectedImg):authUser?.profilePicture?authUser.profilePicture:assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && "rounded-full"}`}/>
            upload profile image
            </label>
            <input type="text" onChange={(e)=>setUsername(e.target.value)} value={userName} className='p-3  border-1 border-gray-500 rounded-md' placeholder='Name' required />
            {/* <input type="text" value={userName} onChange={()=>setUsername(e.target.value)} className='p-3  border-1 border-white rounded-md' placeholder='Name' required /> */}
           <button type='submit' className='bg-blue-700 rounded-3xl px-8 py-2'>Save </button>
         </form>

{/* right */}
        <img src={authUser?.profilePicture ||assets.logo_big} className={`md:w-60 hidden md:block w-30 ${selectedImg && "rounded-full"}`} />
      </div>

    </div>
  )
}

export default ProfilePage