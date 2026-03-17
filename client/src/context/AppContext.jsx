import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {dummyChats, dummyUserData} from '../assets/assets'

const AppContext=createContext()

export const AppContextProvider=({children})=>{

    const navigate=useNavigate()
    const [user, setUser]=useState(null)
    const [chats, setChats]=useState([])
    const [selectedChat, setSelectedChat]=useState(null)
    const [theme, setTheme]=useState(localStorage.getItem('theme')||'light')

    const featchUser=async ()=>{
        setUser(dummyUserData)
    }

    const featchUsersChats=async ()=>{
        setChats(dummyChats)
        setSelectedChat(dummyChats[0])
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
        featchUser()
    },[])

    const value={
        navigate,user, setUser, featchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export const useAppContext=()=>useContext(AppContext)