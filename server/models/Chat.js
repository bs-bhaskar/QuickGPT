import mongoose from "mongoose";

const ChatSchema=new mongoose.Schema({//Schema create👉it tells about what is the format of data in DB  
    userId:{type: String,ref:'User',required:true},//which users chat. ref: 'User' → relation
    userName:{type:String, required:true},//👉store for UI
    name:{type:String,required:true},//👉 chat s' name (default: New Chat)
    messages:[//👉multiple messages in one chat
        {
            isImage:{type:Boolean, required:true},//image or text
            isPublished:{type:Boolean, default:false},//show in community or not
            role:{type:String, required:true},//"user" or "assistant"
            content:{type:String, required:true},//actual message / image URL
            timestamp:{type:Number, required: true}//time store
        }
    ]
},{timestamps:true})//💥 Auto fields:createdAt,updatedAt

const Chat=mongoose.model('Chat',ChatSchema)//👉 MongoDB collection create
export default Chat

// 🧠 FULL DATA STRUCTURE
// {
//   userId: "123",
//   userName: "Bhaskar",
//   name: "New Chat",
//   messages: [
//     {
//       role: "user",
//       content: "Hello",
//       isImage: false,
//       timestamp: 123456
//     },
//     {
//       role: "assistant",
//       content: "Hi!",
//       isImage: false,
//       timestamp: 123457
//     }
//   ]
// }

// 👉 what Chat.js do?
// chat structure define
// messages store
// user relation maintain