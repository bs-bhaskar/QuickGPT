import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
//👉 navigation + user fetch

const Loading = () => {
  const navigate=useNavigate()
  const{featchUser}=useAppContext()//👉 To refresh the user
  useEffect(()=>{
    const timeout=setTimeout(()=>{
      featchUser()
      navigate('/')
    },8000)
    return ()=>clearTimeout(timeout)//👉 memory leak avoid
  },[])
  // 💥 Step-by-step:
  // ⏳ 1. Page load

  // → /loading open

  // ⏳ 2. 8 seconds wait

  // 👉 Why?

  // To Give time to complete Stripe payment

  // 🔄 3. featchUser()

  // 👉 fresh user data from backend

  // 💥 important:

  // webhook adds credits
  // Then updated credits get
  // 🏠 4. navigate('/')

  // 👉 Back to home page
  return (//👉 spinner animation UI
    <div className='bg-gradient-to-b from-[#531B81] to-[#29184B] backdrop-opacity-60 flex items-center justify-center h-screen w-screen text-white text-2xl'>
      <div className='w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin'>
        
      </div>
    </div>
  )
}

export default Loading
// 🧠 FULL PAYMENT FLOW
// user buy plan
// Stripe redirect
// payment done
// Stripe webhook → credits add
// user /loading pe
// 8 sec wait
// user refresh
// updated credits show

// 🔥 FULL LOOP COMPLETE


// 👉 What Loading.jsx do?

// buffer screen after stripe
// user data refresh
// redirect to home