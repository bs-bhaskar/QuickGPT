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

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 20 },
})

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// this line is not correct
// const User = mongoose.model("User", userSchema);
//this line is correct
const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User; 