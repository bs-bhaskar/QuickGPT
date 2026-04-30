import Chat from "../models/Chat.js"
import User from "../models/User.js"
import axios from "axios"
import imagekit from "../configs/imageKit.js"
import openai from "../configs/openai.js"

// Text based AI Chat message Controller
export const textMessageController = async (req, res) => {//👉 API:POST /api/message/text
    try {
        const userId = req.user._id//👉 comes from auth middleware 👉 user identify

        //check credits 
        if(req.user.credits<1){
            return res.json({success:false,message:"you don't  have enough credits to use this feature"})
        }

        const { chatId, prompt } = req.body//Input

        const chat = await Chat.findOne({ userId, _id: chatId })//Find chat
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false })//Save user message. first user message save in DB

        const {choices} = await openai.chat.completions.create({//AI Call
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply={...choices[0].message,timestamp:Date.now(),isImage:false}//💥 Output:👉 AI s' reply
        res.json({success:true,reply})//Send response. 👉 response before DB update after
        chat.messages.push(reply)
        await chat.save()//Save AI reply

        await User.updateOne({_id: userId},{$inc:{credits:-1}})//Deduct credits

    } catch (error) {
        res.json({success:false,message:error.message})
    }
    // 💥 FULL FLOW
    // User → prompt
    // → DB save
    // → AI call
    // → reply
    // → DB save
    // → credit -1
}

// image generation message controller
export const imageMessageController=async (req,res) => {//👉 API:POST /api/message/image
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
        const encodedPrompt=encodeURIComponent(prompt)//👉 for making URL safe
        // ConstructImagekit AI Generation URL
        const generatedImageUrl=`${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;//👉 ImageKit AI generates the image
        // Trigger generation by fitching from imageKit
        const aiImageResponse=await axios.get(generatedImageUrl,{responseType:"arraybuffer"})//👉 get binary image data
        // Convert to Base64
        const base64Image=`data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`//💥 Why? format for upload
        // upload to image kit media library
        const uploadResponse=await imagekit.upload({//💥 Result:👉 public URL
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
        res.json({success:true,reply})//Response

        //Save + deduct credits
        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({_id: userId},{$inc:{credits:-2}})
    } catch (error)
        {
            res.json({success:false, message:error.message})
    }
}
// 🧠 FULL FLOW
// Prompt → ImageKit AI
// → image generate
// → upload
// → URL
// → DB save
// → credit -2

// 👉 what messageController do?

// text AI response
// image generation
// chat history
// credit system