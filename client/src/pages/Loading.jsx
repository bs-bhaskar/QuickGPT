import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Loading = () => {
  const navigate=useNavigate()
  const{featchUser}=useAppContext()
  useEffect(()=>{
    const timeout=setTimeout(()=>{
      featchUser()
      navigate('/')
    },8000)
    return ()=>clearTimeout(timeout)
  },[])
  return (
    <div className='bg-gradient-to-b from-[#531B81] to-[#29184B] backdrop-opacity-60 flex items-center justify-center h-screen w-screen text-white text-2xl'>
      <div className='w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin'>
        
      </div>
    </div>
  )
}

export default Loading
