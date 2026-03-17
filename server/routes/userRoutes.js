//test
// console.log("USER ROUTER LOADED");
//test
import express from 'express'
import { getPublishedImages, getUser, loginUser, registerUser } from '../controllers/userController.js'
import { protect } from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/data', protect, getUser)
userRouter.get('/published-images', getPublishedImages)

export default userRouter

// import express from 'express'

// const userRouter = express.Router()

// userRouter.post('/register', (req, res) => {
//     return res.json({ ok: true })
// })

// export default userRouter