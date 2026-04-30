//test
// console.log("SERVER FILE LOADED");
//test
import express from 'express'
//Express is Node.js framework. it helps to make server
// 👉 Express gives:
// routes
// middleware
// easy API handling
import 'dotenv/config'//👉 loads .env file (process.env)
import cors from 'cors'//Cross-Origin Resource Sharing
// 💥 Problem:
// Frontend (localhost:5173)
// Backend (localhost:3000)

// 👉 browser said: “Different origin → block ❌”

// 💡 Solution: app.use(cors()) 👉 allow cross-origin requests
import connectDB from './configs/db.js'//connectDB → it connect 's MongoDB

import userRouter from './routes/userRoutes.js'//routers → handle routes
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controllers/webhooks.js'//webhook → handle Stripe events
// Express app create
const app=express()//👉 This is our server instance
// Database connect
await connectDB()//👉 this is a async function 👉 connects MongoDB //⚠️ if fail: 💀 server starts but DB not work

//stripe Webhooks Route
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)
//👉 Stripe sends request here => POST /api/stripe
//📦 express.raw() 👉 Takes body in raw format
// 💥 WHY IMPORTANT: Stripe verify signature using raw body
// 👉 if you parse JSON: 💀 signature mismatch → webhook fail

//middleware
app.use(cors())
app.use(express.json())
// 🔥 express.json() 👉 parse incoming requests
//⚠️ Without this: 💀 req.body undefined

//routs
app.get('/',(req,res)=>res.send('Server is live!'))//👉Test Route: health check
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)


const PORT=process.env.PORT || 3000//👉 if .env not have PORT :→ default 3000

app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
})
// 💥 Meaning:
// 👉 server started
// 👉 Then accept requests

// 🧠 FULL FLOW (IMPORTANT)
// Frontend → API call
// → server.js
// → route
// → controller
// → DB / AI
// → response

// 👉 what server.js do?
// server create
// DB connect
// routes attach
// middleware setup
// server start