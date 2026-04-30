import Transaction from "../models/Transaction.js"
import Stripe from "stripe"
//Plans Array (STATIC DATA) not store in db
const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

//API controllers for getting all plans
export const getPlans = async (req, res) => {//👉 API:GET /api/credit/plan
    try {
        res.json({ success: true, plans })//👉 simply returns the plans 👉 frontend use in UI
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)//👉 Stripe instance created 👉 backend handles the payments

//API controller for purchasing the plan
export const purchasePlan = async (req, res) => {//👉 API: POST /api/credit/purchase
    try {
        const { planId } = req.body//Data
        const userId = req.user._id//Data
        const plan = plans.find(plan => plan._id === planId)//Plan find

        if (!plan) {//if plan invalid:
            return res.json({ success: false, message: "Invalid Plan" })
        }
        //create new transaction
        const transaction = await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        })//record create before payment. 💥 Why? traking after the payment

        const {origin}=req.headers;
        const session = await stripe.checkout.sessions.create({//Stripe Session Create
            line_items: [
                {
                    price_data: {
                        currency:"usd",
                        unit_amount:plan.price*100,
                        //Why *100? because stripe works in cents 👉 $10 → 1000 cents
                        product_data:{
                            name:plan.name
                        }
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/loading`,
            cancel_url: `${origin}`,
            metadata: {transactionId:transaction._id.toString(),appId:'quickgpt'},//💥 Why? use in webhook
            expires_at:Math.floor(Date.now()/1000)+30*60, //session expires in 30 minutes
        });
        res.json({success:true,url:session.url})//👉 frontend gets Stripe URL 👉 then redirect
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
// 🧠 FULL FLOW (IMPORTANT 💀)
// User → Buy plan
// → API call
// → transaction create
// → Stripe session
// → redirect
// ↓
// Stripe payment
// ↓
// Webhook
// ↓
// credits add

// 👉 what creditController do?
// plans provide
// Stripe payment start
// transaction create
// 👉 webhook add actual credit