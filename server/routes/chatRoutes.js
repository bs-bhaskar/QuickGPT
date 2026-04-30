import express from "express"//👉 router banane ke liye
import { protect } from "../middlewares/auth.js";//Import middleware👉 🔐 auth check
import { createChat, deleteChats, getChats } from "../controllers/chatController.js";//Import controllers because logic is in controller
//Router create
const chatRouter=express.Router();//👉 like a mini app
//Routes define
chatRouter.post('/create',protect,createChat)
// 🧠 Flow: POST /api/chat/create
// → protect (auth check)
// → createChat (controller)
// 👉 without login → can't create chat
chatRouter.get('/get',protect,getChats)
// 👉 GET /api/chat/get
// → auth
// → user s' chats fetch
chatRouter.post('/delete',protect,deleteChats)
// 👉 POST /api/chat/delete
// → auth
// → specific chat delete
export default chatRouter


// 🧠 FINAL ROUTE FLOW
// Frontend:
// axios.get('/api/chat/get')
// ↓
// server.js:
// app.use('/api/chat', chatRouter)
// ↓
// actual route:
// /api/chat/get
// ↓
// middleware:
// protect
// ↓
// controller:
// getChats()
// ↓
// response

// 👉 what chatRoutes do?
// route define
// middleware attach
// controller call