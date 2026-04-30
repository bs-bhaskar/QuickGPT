// 👉 What AppContext do?

// 🔐 auth handle
// 💬 chats manage
// 🎨 theme manage
// 🌐 API calls centralize
// 🧠 global state store

import { createContext, useContext, useEffect, useState } from "react";
import {dummyChats, dummyUserData} from '../assets/assets'
import axios from 'axios'
import toast from "react-hot-toast";

// createContext → Use to create global data
// useContext → Use to use that global data
// useState → Use to manage state
// useEffect → side effects (API calls etc)
// 👉 axios → Use to talk with Backend
// 👉 toast → for notifications

axios.defaults.baseURL=import.meta.env.VITE_SERVER_URL // 🔥 Real Meaning:
// 👉 we said axios that:
// "Bhai, when API call — start with this URL"

// 🧠 Example
// ❌ Without baseURL:
// axios.get('https://quickgpt-9kju.onrender.com/api/user/data')
// 👉 everywhere you have to write full url 😵

// ✅ With baseURL:
// axios.get('/api/user/data')
// 👉 automatically create:
// https://quickgpt-9kju.onrender.com/api/user/data

const AppContext=createContext()//global stoeage box use to share data in whole app

export const AppContextProvider=({children})=>{//this is a wrapper. we wrap whole app in it(in main.jsx) 
    //these are states
    const [user, setUser]=useState(null)//loggedIn user data
    const [chats, setChats]=useState([])//all chats
    const [selectedChat, setSelectedChat]=useState(null)//current open chat
    const [theme, setTheme]=useState(localStorage.getItem('theme')||'light')//dark light mode
    const [token,setToken]=useState(localStorage.getItem('token')||null)//JWT auth
    //because we use localStorage when you refresh our data safe
    const [loadingUser,setLoadingUser]=useState(true)//loading state when user featching

    const featchUser=async ()=>{
        // setUser(dummyUserData)
        try {
            const {data}= await axios.get('/api/user/data',{headers:{Authorization:`Bearer ${token}`}})//it said to backend that this is the token give me user data
            if(data.success){//user state update
                setUser(data.user)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        finally{//loading is over
            setLoadingUser(false)
        }
    }

    const createNewChat=async () => {
        try {
            if(!user){//if you are not login you will not create new chat  
                toast('Login to create  a new Chat')
                return
            }  

            await axios.post('/api/chat/create',{},{headers:{Authorization:`Bearer ${token}`}})//create new chat in backend
            await featchUsersChats()//then latest chat reload
        } catch (error) {
            toast.error(error.message)
        }
    }

    const featchUsersChats=async ()=>{
        try {
            const {data}=await axios.get('/api/chat/get',{headers:{Authorization:`Bearer ${token}`}})//taking all chats
            if(data.success){
                setChats(data.chats)
                if(data.chats.length===0){// if user have no chats auto create one
                    await createNewChat();
                    return 
                }
                else{
                    setSelectedChat(data.chats[0])//auto open first chat
                }
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    //Theme Handler
    useEffect(()=>{
        if(theme){
            if(theme === 'dark'){
                document.documentElement.classList.add('dark');//tailwind dark mode on
            }
            else{
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('theme',theme)//save for future
        }
    },[theme])

    useEffect(()=>{
        if(user){//when user login chat featch
            featchUsersChats()
        }
        else{//logout-->reset everything
            setChats([])
            setSelectedChat(null)
        }
    },[user])

    useEffect(()=>{
        if(token){//token comes--> user data featch
            featchUser()
        }
        else{//no token no user
            setUser(null)
            setLoadingUser(false)
        }
    },[token])

    const value={//all are accessible in whole app
        user, setUser, featchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, createNewChat, loadingUser, featchUsersChats, token, setToken, axios
    }
    //give data to whole app
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export const useAppContext=()=>useContext(AppContext)