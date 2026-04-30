import mongoose from "mongoose";//👉 MongoDB ORM
// Schema create
const transactionSchema=new mongoose.Schema({//👉 payment record define
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    // 🧩 userId 👉 which user purchase
    // 🧩 planId 👉 which plan buy
    // 🧩 amount 👉 how much money give
    // 🧩 credits 👉 how much credits get
    // 🧩 isPaid 👉 payment complete or not
    //👉 initially👉isPaid: false
    //👉 after webhook👉 isPaid: true
},{timestamps:true})//use to tracking when payment done
const Transaction=mongoose.model('Transaction',transactionSchema);//Model create
export default Transaction;
// 🧠 FULL FLOW (IMPORTANT 💀)
// 💳 Step-by-step:
// user select the plan
// purchasePlan: transaction create (isPaid: false)
// Stripe payment
// webhook:
//👉 did this:
// isPaid = true
// credits add

// 💀 WHY TRANSACTION NEEDED?
// 👉 without this:
// can not track
// fraud possible
// duplicate payment issue

// 🧠 FINAL SUMMARY
// 👉 what Transactions.js do?
// payment record store
// credits mapping
// webhook tracking