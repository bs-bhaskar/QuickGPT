//test
// console.log("USER CONTROLLER LOADED");
//test

import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import Chat from '../models/Chat.js'
//Generate JWT
const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}
// {id} → payload (user id)
// JWT_SECRET → secret key
// 30d → expiry
// 🔥 Result:
// 👉 get token string 
// 👉 store in frontend

// API to register User
export const registerUser= async (req,res)=>{//👉 API:POST /api/user/register
    const {name,email,password}=req.body;//data
    try {
        const userExist=await User.findOne({email})//check existing user
        if(userExist){
            return res.json({success: false, message:"User already exists"})//if already there:
        }

        const user=await User.create({name,email,password})//create user
        //👉 password hashing model me ho raha hai (pre-save hook)

        const token=generateToken(user._id)//token

        res.json({success:true, token})//response  
        // res.json({success:true, token:token, message: "User registered successfully"})

    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

//API to login user
export const loginUser= async(req,res)=>{//👉 API:POST /api/user/login
    const {email,password}=req.body//input
    try {
        const user=await User.findOne({email})//find user
        if(user){
            const isMatch = await bcrypt.compare(password, user.password)//compare password
            if(isMatch){
                const token=generateToken(user._id)
                return res.json({success:true,token})
            }
        }
        return res.json({success:false, message:"inValid Email or Password"})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//API to create user Data
export const getUser= async(req,res)=>{//👉 API:GET /api/user/data
    try {
        // 👉 user already attached by auth middleware. only return it
        const user=req.user
        return res.json({success:true,user})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }  
}
//API to get published images
export const getPublishedImages=async (req,res) => {//👉 API:GET /api/user/published-images
    try {
        const publishedImageMessages=await Chat.aggregate([// MongoDB Aggregation
            {$unwind:"$messages"},//👉 bracks messages array
            {
                $match:{//filter
                    "messages.isImage":true,
                    "messages.isPublished":true
                }
            },
            {
                $project:{
                    _id:0,
                    imageUrl:"$messages.content",
                    userName:"$userName"
                }
            }
        ])
        res.json({success:true,images:publishedImageMessages.reverse()})//👉 latest first
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
// 🧠 FULL FLOW
// User → login
// → token
// → auth middleware
// → req.user
// ↓
// Community page
// → aggregation
// → images

// 👉 what userController do?
// user register
// login
// auth data
// community images