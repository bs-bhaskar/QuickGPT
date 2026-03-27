import jwt from "jsonwebtoken"
import User from "../models/User.js"
export const protect = async (req, res, next) => {
    // let token = req.headers.authorization
    try {
        //change
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.json({ success: false, message: "Token missing" })
        }

        const token = authHeader.split(" ")[1]
        //change

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const userId = decoded.id

        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "not authorized, user not found" })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ message: "not authorized, token failed" })
    }
}

