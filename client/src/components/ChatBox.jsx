import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

// useRef → scrolling control
// useAppContext → global data access
// Message → UI of every message

const ChatBox = () => {

  const containerRef=useRef(null)// 👉 reference of chat scroll container // 👉 use in auto scroll auto scroll

  // 👉 all comes from global state:
  const {selectedChat,theme,user,axios,token,setUser}=useAppContext()
  // selectedChat → current chat
  // user → logged in user
  // token → auth
  // axios → API call
  // setUser → credits update

  // 🔥 Meaning:
  const [messages,setMessages]=useState([])
  const [loading,setLoading]=useState(false)
  const[prompt,setPrompt]=useState('')
  const[mode,setMode]=useState('text')
  const[isPublished,setIsPublished]=useState(false)
  // messages → UI me dikhne wale chats
  // loading → AI response wait
  // prompt → input text
  // mode → text / image
  // isPublished → image community me jayegi ya nahi

  const onSubmit=async(e)=>{//when user send 's message
    try {
      e.preventDefault()//Prevent reload

      if(loading) return
      if(!user) return toast('Login to send message')//👉 guest → no access
        setLoading(true)
      
      //Backup prompt
      const promptCopy=prompt
      setPrompt('')
      //👉 UI gets clear//👉 error comes → start restore

      setMessages(prev=>[...prev,{role:'user',content:prompt, timestamp:Date.now(),isImage:false}])//User message add in UI //Before AI reply user message show

      const {data}=await axios.post(`/api/message/${mode}`,{chatId:selectedChat._id,prompt,isPublished},{headers:{Authorization:`Bearer ${token}`}})// in this line data send to /api/message/${mode} like selected chat id, token, is published or not and prompe //here mode means image AI/text AI
      if(data.success){
        setMessages(prev=>[...prev,data.reply])//AI reply add in UI
        //decrease credits
        if(mode==='image'){
          setUser(prev =>({...prev,credits:prev.credits-2}))
        }
        else{
          setUser(prev =>({...prev,credits:prev.credits-1}))
        }
      }
      else{//👉 user text again set in input
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    } catch (error) {
      toast.error(error.message)
    }
    finally{//👉 cleanup
      setPrompt('')
      setLoading(false)
    }
  }

  useEffect(()=>{//👉 when user select new chat:→ messages update
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{//new message → auto scroll bottom
    if(containerRef.current){
      containerRef.current.scrollTo({
        top:containerRef.current.scrollHeight,
        behavior:"smooth",
      })
    }
  },[messages])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      {/* Chat messages  */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length===0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img src={theme==='dark'?assets.logo_full:assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68' />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything.</p>
          </div>
        )}
        {/* 🧾 Messages Display */}
        {messages.map((message,index)=><Message key={index} message={message} />)}{/* 👉 every message → Message component */}

        {/* Three dot loading  */}
        {
          loading && <div className='loader flex items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        }
      </div>
      
      {/* 🎨 Image Mode Option */}
      {/* 👉 only show in image mode */}
      {mode==='image'&&(
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
          <p className='text-xs'>Publish Generated Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)} value={isPublished} />
        </label>
      )}

      {/* prompet input box */}
      <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center'>
        <select onChange={(e)=>setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none'>
          <option className='dark:bg-purple-900' value="text">Text</option>
          <option className='dark:bg-purple-900' value="image">Image</option>
        </select>
        <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} type="text" placeholder='Type your prompt hear...' className='flex-1 w-full text-sm outline-none' required />
        <button disabled={loading}>{/* 👉 spam prevention 😏 */}
          <img src={loading?assets.stop_icon:assets.send_icon} className='w-8 cursor-pointer' alt="" />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
