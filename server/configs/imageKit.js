import ImageKit from "imagekit"//👉 official SDK of ImageKit
// what ImageKit do?
// Cloud media service (like AWS S3 but easier)
// 👉 use:
// image upload
// CDN delivery
// transformations
var imagekit = new ImageKit({//👉 this object creating which comes in the use of upload yeh
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,//👉 for frontend or public operations
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,//👉 server-side secret key
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT//👉 CDN base URL
});

export default imagekit;

// 💥 Flow (IMPORTANT)
// user gives prompt
// backend generate image
// gets image buffer
// upload to imageKit
// get public URL
// store in DB

// Upload Example (already in code)
// const uploadResponse = await imagekit.upload({
//   file: base64Image,
//   fileName: `${Date.now()}.png`,
//   folder: "quickgpt"
// })

// 💥 Result:
// 👉 uploadResponse.url
// 👉 this is public image link

// 🧠 SIMPLE FLOW
// AI → image generate
// → ImageKit upload
// → CDN link
// → user ko show

// 🧠 FINAL SUMMARY

// 👉 what imageKit.js do?
// configure ImageKit 
// ready upload system
// CDN gives access