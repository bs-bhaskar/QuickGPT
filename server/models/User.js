//////// this commented code cause error "next is not a function" because this code is not working with mondo db new version
// import mongoose from 'mongoose'
// import bcrypt from 'bcryptjs'
// const userSchema=new mongoose.Schema({
//     name:{type: String, required: true},
//     email:{type: String, required: true, unique: true},
//     password:{type: String, required: true},
//     credits:{type: Number, default: 20},
// })

// //Hash password befor saving 
// userSchema.pre('save',async function (next) {
//     if(!this.isModified('password')){
//         return next()
//     }
//     const salt = await bcrypt.genSalt(10)
//     this.password=await bcrypt.hash(this.password,salt)
//     next()
// })

// const User=mongoose.model("User",userSchema)

// export default User


/// this code is good for latest version

import mongoose from 'mongoose'//mongoose → DB schema/model
import bcrypt from 'bcryptjs'//bcryptjs → password hashing (security)

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 20 },
    // 🧩 name 
    // 👉 user s' display name
    // 🧩 email👉 unique: true
    // 👉 2 accounts not created with same email

    // 🧩 password
    // 👉 plain text not store (hash needed)

    // 🧩 credits
    // 👉 starting credits = 20
    // 👉 deduct in every AI call
})

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);//👉 add random string in hashing
    this.password = await bcrypt.hash(this.password, salt);//👉 password → unreadable string
    // 🔹 pre('save')
    // 👉 when user save → this function run

    // 🔹 this.isModified('password')
    // 👉 check:
    // password change or not
    //💥 Why?👉 oterwise in every save password again hash→ login fail 💀
});
// this line is not correct
// const User = mongoose.model("User", userSchema);
//this line is correct
const User = mongoose.models.User || mongoose.model("User", userSchema)//🧠 Why yeh syntax?👉 hot reload / multiple imports me:❌ duplicate model error avoid

export default User; 

// 🧠 FULL FLOW (AUTH SYSTEM)
// 🧾 Register
// user data aaya
// User.create()
// pre-save hook run
// password hash
// DB save

// 🔐 Login
// user email find
// bcrypt.compare()
// hashed vs entered password
// match → login

// 👉 what User.js do?
// user data store
// secure password
// track credits