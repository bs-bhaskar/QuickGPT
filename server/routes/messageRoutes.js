import express from 'express';//👉 for creating router
import {protect} from '../middlewares/auth.js'
//controllers import
import { imageMessageController, textMessageController } from '../controllers/messageController.js';//here actual AI logic
const messageRouter=express.Router()//for grouping routes

messageRouter.post('/text',protect,textMessageController)
// 🧠 Flow:
// POST /api/message/text
// ↓
// protect (auth check)
// ↓
// textMessageController
// ↓
// AI response
// 👉 user prompt → AI reply
messageRouter.post('/image',protect,imageMessageController)
// 🧠 Flow:
// POST /api/message/image
// ↓
// protect
// ↓
// imageMessageController
// ↓
// ImageKit AI
// ↓
// image URL
// 👉 prompt → AI image
export default messageRouter

// 🧠 FULL FLOW (IMPORTANT 💀)
// 💬 TEXT FLOW
// Frontend:
// axios.post('/api/message/text', { prompt })
// ↓
// server:
// /api/message/text
// ↓
// protect → user verify
// ↓
// controller → AI call
// ↓
// response → UI
// 🎨 IMAGE FLOW
// Frontend:
// axios.post('/api/message/image', { prompt })
// ↓
// ImageKit generate
// ↓
// upload
// ↓
// URL return

// 👉 what messageRoutes do?
// AI text call
// AI image call
// auth enforce