import mongoose from 'mongoose';//ORM for MongoDB (Object Relational Mapping)
//💡 Without mongoose: you have to write raw MongoDB queries 😵‍💫
// 💡 With mongoose:
// create schemas
// use models
// easy queries

const connectDB=async () => {//👉 it is a async function because DB connection takes time
    try {
        mongoose.connection.on('connected',()=>console.log('Database Connected'))//👉 when MongoDB successfully connect:→ "Database Connected" print in console
        await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`)
    } catch (error) {
        console.log(error.message)
    }
}
export default connectDB;

// 🧠 FULL FLOW
// server.js: await connectDB()
// ↓
// db.js: MongoDB connect
// ready for queries
// ↓
// controllers:
// Chat save
// User fetch
// Messages store

// 👉 what db.js do?

// MongoDB connect
// gives data layer to app
// widthout this backend useless