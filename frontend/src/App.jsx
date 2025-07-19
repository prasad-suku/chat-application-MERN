import React, { useContext } from 'react'
import {Routes,Route, Navigate} from "react-router-dom"
import Login from './pages/Login'
import Home from './pages/Home'
import ProfilePage from './pages/ProfilePage'
import PageNotFound from './pages/PageNotFound'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/Authcontext'
const App = () => {
  const {token} = useContext(AuthContext)
  return (
    <div className='bg-gray-950 '>
     <Toaster/>
     <Routes>
      <Route path='/' element={token?<Home />:<Navigate to='/login'/>} />

      <Route path='/login' element={!token?<Login /> :<Navigate to='/' />} />
      <Route path='/profile' element={token?<ProfilePage /> :<Navigate to='/login'/>} />
      <Route path='/*' element={<PageNotFound />} />
     </Routes>

    </div>
  )
}

export default App