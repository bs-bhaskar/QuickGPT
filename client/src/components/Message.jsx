import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

// moment → time format ("2 min ago")
// Markdown → format AI response
// Prism → highlight code

const Message = ({message}) => {//👉 one message object receiving
  //useEffect — Code Highlighting
  useEffect(()=>{
    Prism.highlightAll()
  },[message.content])
  //👉 whenever message change:→ Prism highlight every <code> blocks 
  return (

    <div>
      {/*  */}
      {message.role==="user"?(
        <div className='flex items-start justify-end my-4 gap-2'>{/* 👉 right side align */}
          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
            <p className='text-sm dark:text-primary'>{message.content}</p>{/* simple text show */}
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>{/* 👉 "2 min ago" */}
          </div>
          <img src={assets.user_icon} alt="" className='w-8 rounded-full'/>{/* 👉 user Avatar */}
        </div>
      )
      :
      (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4'>{/* 👉 left side show */}
          {message.isImage?(
            <img src={message.content} className='w-full max-w-md mt-2 rounded-md' alt="" />
          ):
          (
            <div className='text-sm dark:text-primary reset-tw'>
              <Markdown>{message.content}</Markdown> 
            </div>
          )}
          {/* 
            👉 AI response:
                headings
                lists
                code
                bold
            🔥 ChatGPT feel
          */}
          <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>{/* 👉 same time display */}
        </div>
      )
    }
    </div>
  )
}

export default Message
