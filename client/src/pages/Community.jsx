import React,{useEffect, useState} from 'react'
import { dummyPublishedImages } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Community = () => {
  const [images,setImages]=useState([])//→ gallery data
  const [loading,setLoading]=useState(true)//loading → API wait
  const {axios}=useAppContext()//👉 For API calls

  const fetchImages=async ()=>{
    // setImages(dummyPublishedImages)
    // setLoading(false)
    try {
      const {data}=await axios.get('/api/user/published-images')//👉 From backend: only published images
      if(data.success){
        setImages(data.images)//👉 images state update
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }
  useEffect(()=>{
    fetchImages()//👉 page load → API call
  },[])
  // 👉 jab tak data nahi aata:→ spinner
  if(loading) return <Loading />
  return (
    <div className='p-6 pt-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll'>
      <h2 className='text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100'>Community Images</h2>
      {/* {images.length>0 ? (...) : (...) } */}
      {images.length>0?(
        <div className='flex flex-wrap max-sm:justify-center gap-5'>
          {/* 👉 loop through images */}
          {images.map((item,index)=>(
            // 👉 click → full image open
            <a key={index} href={item.imageUrl} target='_blank' className='relative group block rounded-lg overflow-hidden border border-gray-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow duration-300'>
              {/* 👉 image show */}
              <img src={item.imageUrl} alt="" className='w-full h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out' />
              {/* 👤 Creator Name 👉 show on hover */}
              <p className='absolute bottom-0 right-0 text-xs bg-black/50 backdrop-blur text-white px-4 py-1 rounded-tl-xl opacity-0 group-hover:opacity-100 transition duration-300'>Created by {item.userName} </p>
            </a>
          ))}
        </div>
      ):(
        // 👉 fallback UI
        <p className='text-center text-gray-600 dark:text-purple-200 mt-10'>No Images Availiable.</p>
      )}
    </div>
  )
}

export default Community
// 🧠 FULL FLOW

// User → Community page
// → API call
// → MongoDB aggregation
// → images
// → UI grid

// 👉 What Community.jsx do?

// public images fetch
// grid render
// hover info
// loading handling