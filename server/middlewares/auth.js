import jwt from "jsonwebtoken"//jsonwebtoken → JWT verify karega
import User from "../models/User.js"//User → DB se user fetch

// Middleware Function
export const protect = async (req, res, next) => {
    // 👉 what is middleware?
    // function who runs b/w requect
    // 💥 Flow:
    // Request → middleware → controller

    // let token = req.headers.authorization
    try {
        //change
        const authHeader = req.headers.authorization//Authorization Header

        //Token check
        if (!authHeader) {  
            return res.json({ success: false, message: "Token missing" })//👉 if token not→ access denied
        }

        const token = authHeader.split(" ")[1]//Extract token
        //change

        const decoded = jwt.verify(token, process.env.JWT_SECRET)//Verify token
        // 👉 check:
        // is token valid?
        // is expire?
        // tampered?

        const userId = decoded.id//Extract userId
        //what JWT do in payload?
        //{ id: user._id }

        const user = await User.findById(userId)//Find user

        if (!user) {//❌ if user not find:
            return res.json({ success: false, message: "not authorized, user not found" })
        }
        req.user = user//Attach user
        // req.user available in every container
        next()//👉 middleware complete👉 next controller run
    } catch (error) {
        res.status(401).json({ message: "not authorized, token failed" })
    }
}
// 🧠 FULL FLOW
// Frontend → request
// ↓
// Authorization header
// ↓
// auth middleware
// ↓
// token verify
// ↓
// user attach
// ↓
// controller

// 👉 what auth.js do?
// token check
// user verify
// access control
// request secure

//////////////////// SOME IMPORTANT QUES.. \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// 1. next() call na kare to kya hoga?
// 👉 middleware wahi pe request ko rok dega

// 💀 result:
// controller kabhi run hi nahi karega
// request “pending” rahegi (hang ho jayegi)

// 👉 simple:
// next() = “aage jaa”
// bina iske → traffic jam 🚧

// 2. req.user = user kyu important hai?
// 👉 yeh line gold hai 💀

// 💥 Meaning:
// middleware → user verify
// controller → directly use kare

// 💡 Example:
// const userId = req.user._id

// 👉 bina req.user:
// har controller me token decode karna padta
// code messy ho jata

// 👉 with req.user:
// ✔️ clean
// ✔️ reusable
// ✔️ scalable

// 3. token expire ho gaya to?
// 👉 jwt.verify() fail karega
// ↓
// 👉 catch block chalega

// res.status(401).json({ message: "not authorized, token failed" })
// 💀 result:
// user logout jaisa behave karega
// frontend bolega → login again