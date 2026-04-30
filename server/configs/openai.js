import {OpenAI} from "openai";//👉 official SDK (OpenAI compatible)

const openai = new OpenAI({//👉 this is a  client object we call API through this
    // apiKey: "GEMINI_API_KEY",
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
export default openai
// 💥 Example call
// const {choices} = await openai.chat.completions.create({
//   model: "gemini-3-flash-preview",//👉 fast + cheap model
//   messages: [//👉 chat format
//     {
//       role: "user",
//       content: prompt,
//     },
//   ],
// });
// 🔹 response
// choices[0].message

// 👉 AI s' reply

// 🧠 FULL FLOW
// User → prompt
// → backend
// → openai.js
// → Gemini API
// → response
// → DB save
// → frontend

// 👉 what openai.js do?
// AI client create
// Gemini API connect
// text generation enable