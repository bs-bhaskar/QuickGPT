import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route,Routes, useLocation } from 'react-router-dom'//Routing
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'//global state
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'//notifications
const App = () => {

  const {user,loadingUser}=useAppContext()
  // user → logged in or not
  // loadingUser → user fetch or not

  const [isMenuOpen,setIsMenuOpen]=useState(false)//👉 mobile sidebar control
  const {pathname}=useLocation()//👉 current URL path

  if(pathname === '/loading'||loadingUser) return <Loading />
  // Meaning:
  // 👉 loading see in two cases:

  // after Stripe payment /loading
  // user data fetch or not

  // 👉 Until then the app does not render

  return (
    <>
    {/*  */}
    <Toaster />{/* 👉 enable notifications in whole app */}
    {/* 👉 sidebar open button in mobile */}
    {!isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert' onClick={()=>setIsMenuOpen(true)} alt="" /> }
    {/* MAIN CONDITION */}
    {/* 
      {user ? (APP UI) : (LOGIN UI)}
      ✅ if user:
          Sidebar
          ChatBox
          Credits
          Community
      ❌ if user not:
          only Login page
      👉 That's why:
          login/logout → UI change
    */}
    {user ? (
      <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
      <div className='flex h-screen w-screen'>{/* 🔹 AUTHENTICATED UI */}
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
        <Routes> {/* 👉 navigation system */}
          <Route path='/' element={<ChatBox/>}/>
          <Route path='/credits' element={<Credits/>}/>
          <Route path='/community' element={<Community/>}/>
        </Routes>
      </div>
    </div>
    ):(
      <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
        <Login/>{/* 👉 full screen login */}
      </div>
    )}
    </>
  )
}

export default App
// 🧠 FULL FLOW

// App start:
// token check
// user fetch
// loading screen
// user exist?
// yes → app
// no → login

// 👉 What App.jsx do?

// routing control
// auth based rendering
// loading handling
// layout structure