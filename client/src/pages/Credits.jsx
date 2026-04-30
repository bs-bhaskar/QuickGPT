//💳 Payment + credits system UI

import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
const Credits = () => {
  const [plans, setPlans]=useState([])//plans → pricing data
  const [loading, setLoading]=useState(true)//loading → API wait
  const {token,axios}=useAppContext()
  // 👉 token → protected route
  // 👉 axios → API

  const fetchPlans=async ()=>{
    // setPlans(dummyPlans)
    // setLoading(false)
    try {//👉 backend se:pricing plans
      const {data}=await axios.get('/api/credit/plan',{
        headers:{Authorization:`Bearer ${token}`}
      })
      if(data.success){
        setPlans(data.plans)//👉 UI update
      }
      else{
        toast.error(data.message || 'Failed to fetch plans ')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)//🔚 Loading off
  }

  const purchasePlan=async (planId) => {
    try {
      const {data}=await axios.post('/api/credit/purchace',{planId}, {headers:{Authorization:`Bearer ${token}`}})//👉 backend:Stripe session create karega
      if(data.success){
        window.location.href=data.url//👉 🔥 user redirect ho jaata hai:→ Stripe checkout page
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchPlans()//👉 page load → plans fetch
  },[])
  if(loading) return <Loading/>
  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white'>Credit Plans</h2>
      <div className='flex flex-wrap justify-center gap-3'>
        {/* 👉 har plan render */}
        {plans.map((plan)=>(
          <div key={plan._id} className={`border border-gray-200 dark:border-purple-700 rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-[300px] flex flex-col ${plan._id==="pro"?"bg-purple-50 dark:bg-purple-900":"bg-white dark:bg-transparent"}`}>
            {/* 💡 Plan Card */}
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>{plan.name}</h3>
              <p className='text-2xl font-bold text-purple-600 dark:text-purple-300 mb-4'>${plan.price}
                <span className='text-base font-normal text-gray-600 dark:text-purple-200'>{' '}/ {plan.credits} credits</span>
              </p>
              <ul className='list-disc list-inside text-sm text-gray-700 dark:text-purple-200 space-y-1'>
                {/* 👉 dynamic features */}
                {plan.features.map((feature,index)=>(
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            {/* Buy Button */}
            {/* 👉 async feedback */}
            <button onClick={()=>toast.promise(purchasePlan(plan._id),{loading:'Processing...'})} className='mt-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium py-2 rounded transition-colors cursor-pointer'>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
// 🧠 FULL PAYMENT FLOW (IMPORTANT)

// User → click Buy
// → /api/credit/purchase
// → Stripe session
// → redirect
// → payment

// 👉 then:

// Stripe → webhook → backend
// → credits add in DB

// 👉 What Credits.jsx do?

// plans fetch
// UI display
// Stripe redirect
// payment trigger