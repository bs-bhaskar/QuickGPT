import Chat from "../models/Chat.js"
import User from "../models/User.js"
import axios from "axios"
import imagekit from "../configs/imageKit.js"
import openai from "../configs/openai.js"

// Text based AI Chat message Controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        //check credits 
        if(req.user.credits<1){
            return res.json({success:false,message:"you don't  have enough credits to use this feature"})
        }

        const { chatId, prompt } = req.body

        const chat = await Chat.findOne({ userId, _id: chatId })
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false })

        const {choices} = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply={...choices[0].message,timestamp:Date.now(),isImage:false}
        res.json({success:true,reply})
        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId},{$inc:{credits:-1}})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// image generation message controller
export const imageMessageController=async (req,res) => {
    try {
        const userId=req.user._id
        //check credits
        if(req.user.credits<2){
            return res.json({success:false,message:"You don't have enough credits to use this feature"})
        }
        const {prompt, chatId, isPublished}=req.body
        //FInd chat
        const chat=await Chat.findOne({userId,_id:chatId})
        //push user message
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });
        // Encode the prompt
        const encodedPrompt=encodeURIComponent(prompt)
        // ConstructImagekit AI Generation URL
        const generatedImageUrl=`${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;
        // Trigger generation by fitching from imageKit
        const aiImageResponse=await axios.get(generatedImageUrl,{responseType:"arraybuffer"})
        // Convert to Base64
        const base64Image=`data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`
        // upload to image kit media library
        const uploadResponse=await imagekit.upload({
            file:base64Image,
            fileName:`${Date.now()}.png`,
            folder:"quickgpt"
        })
        const reply={
            role:'assistant',
            content:uploadResponse.url,
            timestamp:Date.now(),
            isImage:true,
            isPublished
        }
        res.json({success:true,reply})
        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({_id: userId},{$inc:{credits:-2}})
    } catch (error)
        {
            res.json({success:false, message:error.message})
    }
}