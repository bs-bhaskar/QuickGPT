import { createContext, useContext, useEffect, useState } from "react";
import {dummyChats, dummyUserData} from '../assets/assets'
import axios from 'axios'
import toast from "react-hot-toast";

axios.defaults.baseURL=import.meta.env.VITE_SERVER_URL 

const AppContext=createContext()

export const AppContextProvider=({children})=>{

    const [user, setUser]=useState(null)
    const [chats, setChats]=useState([])
    const [selectedChat, setSelectedChat]=useState(null)
    const [theme, setTheme]=useState(localStorage.getItem('theme')||'light')
    const [token,setToken]=useState(localStorage.getItem('token')||null)

    const [loadingUser,setLoadingUser]=useState(true)

    const featchUser=async ()=>{
        // setUser(dummyUserData)
        try {
            const {data}= await axios.get('/api/user/data',{headers:{Authorization:`Bearer ${token}`}})
            if(data.success){
                setUser(data.user)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        finally{
            setLoadingUser(false)
        }
    }

    const createNewChat=async () => {
        try {
            if(!user){    
                toast('Login to create  a new Chat')
                return
            }  

            await axios.post('/api/chat/create',{},{headers:{Authorization:`Bearer ${token}`}})
            await featchUsersChats()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const featchUsersChats=async ()=>{
        try {
            const {data}=await axios.get('/api/chat/get',{headers:{Authorization:`Bearer ${token}`}})
            if(data.success){
                setChats(data.chats)
                //if the user has no chats, create one
                if(data.chats.length===0){
                    await createNewChat();
                    return 
                }
                else{
                    setSelectedChat(data.chats[0])
                }
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(theme){
            if(theme === 'dark'){
                document.documentElement.classList.add('dark');
            }
            else{
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('theme',theme)
        }
    },[theme])

    useEffect(()=>{
        if(user){
            featchUsersChats()
        }
        else{
            setChats([])
            setSelectedChat(null)
        }
    },[user])

    useEffect(()=>{
        if(token){
            featchUser()
        }
        else{
            setUser(null)
            setLoadingUser(false)
        }
    },[token])

    const value={
        user, setUser, featchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, createNewChat, loadingUser, featchUsersChats, token, setToken, axios
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export const useAppContext=()=>useContext(AppContext)