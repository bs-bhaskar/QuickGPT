//test
// console.log("USER ROUTER LOADED");
//test
import express from 'express'//👉 for creating router
//controllers import
import { getPublishedImages, getUser, loginUser, registerUser } from '../controllers/userController.js'//real logic hear
import { protect } from '../middlewares/auth.js'

const userRouter = express.Router()//for grouping the routes

userRouter.post('/register',registerUser)
// 🧠 Flow:
// POST /api/user/register
// ↓
// controller:
// user create
// password hash
// JWT token
// 👉 new user signup
userRouter.post('/login',loginUser)
// 🧠 Flow:
// POST /api/user/login
// ↓
// controller:
// email check
// password compare
// token generate
// 👉 existing user login
userRouter.get('/data', protect, getUser)
// 🧠 Flow:
// GET /api/user/data
// ↓
// protect (token verify)
// ↓
// getUser()
// ↓
// user data return
// 👉 current logged-in user ka data
userRouter.get('/published-images', getPublishedImages)
// 🧠 Flow:
// GET /api/user/published-images
// ↓
// aggregation
// ↓
// images return
// 👉 sab users ke public images
export default userRouter

// import express from 'express'

// const userRouter = express.Router()

// userRouter.post('/register', (req, res) => {
//     return res.json({ ok: true })
// })

// export default userRouter




// 🧠 FULL FLOW (IMPORTANT 💀)
// 🔐 AUTH FLOW
// Register/Login
// ↓
// token
// ↓
// frontend store
// ↓
// API request
// ↓
// protect middleware
// ↓
// req.user
// ↓
// controller
// 🌍 COMMUNITY FLOW
// Frontend:
// axios.get('/api/user/published-images')
// ↓
// backend:
// aggregation
// ↓
// images
// ↓
// UI

// 👉 what userRoutes do?
// auth handle
// user data provide
// community feature enable