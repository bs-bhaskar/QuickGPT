import Chat from "../models/Chat.js"

//api controller for cheating new chat
export const createChat = async (req,res) => {//👉 API:POST /api/chat/create
    try {
        const userId=req.user._id
        // 👉 where req.user comes from? 👉 💀 through auth middleware (after JWT verify)
        const chatData={
            userId,//userId → owner
            messages:[],//messages → empty start
            name:"New Chat",//name → default
            userName:req.user.name//userName → display
        }
        await Chat.create(chatData)//👉 save or insert in MongoDB
        res.json({success:true,message:"Chat created"})//Response
        // 💥 Flow
        // User → new chat click
        // → API
        // → new chat in DB 
        // → UI update
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//API controller for geating all chats
export const getChats = async (req,res) => {//👉 API:GET /api/chat/get
    try {
        const userId=req.user._id
        const chats=await Chat.find({userId}).sort({updatedAt:-1})//find chats
        // 👉 find({userId})→ only that user s' chats
        // 👉 .sort({updatedAt:-1}) → latest chat
        res.json({success:true,chats})//Response
    } catch (error) {
        res.json({success:false,message:error.message})
    }
    // 💥 Flow
    // User → sidebar open
    // → API call
    // → chats load
    // → UI render
}

//API controller for deleting a chat
export const deleteChats = async (req,res) => {//👉 API:POST /api/chat/delete
    try {
        const userId=req.user._id//userId
        const {chatId}= req.body//chatId

        await Chat.deleteOne({_id:chatId, userId})//Delete
        // 👉 that means: only those chat delete which related to that user
        //no other user chat delete
        res.json({success:true,message:"Chat Deleted"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
// 🧠 FULL FLOW
// Frontend → delete click
// → API
// → DB delete
// → UI update

// 👉 what chatController do?
// chat create
// chat fetch
// chat delete