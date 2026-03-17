import mongoose from "mongoose";
const transactionSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    planId:{type:String,required:true},
    planId:{type:Number,required:true},
    planId:{type:Number,required:true},
    planId:{type: String, required: true},
},{timestamps:true})
const Transaction=mongoose.model('Transaction',transactionSchema);
export default Transaction;