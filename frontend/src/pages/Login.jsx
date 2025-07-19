import React, { useContext, useState,useEffect } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/Authcontext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const login = () => {
const navigate = useNavigate();
  const { login,authUser, token } = useContext(AuthContext);

  const [currState, setCurrentState] = useState("Login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDataSubmited, setIsdatasubmited] = useState(false);

 const handleSubmit = async (event) => {
  event.preventDefault();
  const endpoint = currState === "signUp" ? "register" : "login";
  const payload = endpoint === "login"
    ? { email, password }
    : { fullName, email, password };

   await login(endpoint, payload);
  // if (success) {
  //   navigate("/"); // redirect only after successful login/register
  // }

};


  // // // Redirect to home if token exists after login/register
  useEffect(() => {
    if (token) {    
      navigate("/");
    }
  }, []);


  return (
   <div className='min-h-screen flex items-center py-5 md:flex-row flex-col pt-4 justify-between gap-4 md:mx-30 md:py-10'>
     {/* left  */}
      <div className='flex flex-col justify-center items-center'>
     <img src={assets.logo_big} alt="logo" className='w-[min(20vw,290px)]' />
      <p className='text-white font-bold md:text-2xl text-xl  '>Quick Chat</p>
      </div>
    {/* right */}

    <form onSubmit={handleSubmit} className='border-1 md:w-[350px] shadow-2xl bg-white/8 text-white border-gray-500 p-6  flex flex-col gap-2 rounded-xl'>
      <div className='font-medium flex justify-between gap-2 text-center mb-3 text-2xl'>{currState} <span><img src={assets.arrow_icon} className='w-7' alt="" /></span></div>
       {isDataSubmited && currState=="signUp"?(
        <>
      
           <label htmlFor="username">UserName</label>
        <input type='text' value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder='UserName' className='p-2 border border-gray-500 rounded-md' required/>
          <label htmlFor="Email"/> Email
         <input type='email' id='Email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email' className='p-2 border border-gray-500 rounded-md' required/>
        <label htmlFor="Password" />Password
         <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' className='p-2 border border-gray-500 rounded-md' required/>
          </>
       ):(
        <>
         <label htmlFor="Email"/> Email
         <input type='email' id='Email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email' className='p-2 border border-gray-500 rounded-md' required/>
        <label htmlFor="Password" />Password
         <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' className='p-2 border border-gray-500 rounded-md' required/>
        </>
       )}


       <button type='submit' className='bg-blue-500 p-2 mb-3 rounded-md mt-4 cursor-pointer'>
        {currState=="signUp"?"Create an Account":"login"}
       </button>
       
       <div className='flex items-centergap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use privacy policy.</p>
       </div>

       <div className='flex flex-col gap-2'>
        {currState=="signUp"?(
          <p className='text-sm text-gray-600'>Already have an Account <span onClick={()=>{setCurrentState("login")}} className='font-medium text-violet-500 cursor-pointer'>login here</span> </p>
        ):(
          <p className='text-sm text-gray-600'>Don't have account create one  <span onClick={()=>{setCurrentState("signUp");setIsdatasubmited(true);setEmail(null),setFullName(null),setPassword(null)}} className="font-medium text-violet-500 cursor-pointer">Click here</span></p>
        )}

       </div>
    </form>
   </div>
)
}

export default login