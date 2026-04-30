import Stripe from "stripe";//👉 Stripe → events verify
import Transaction from "../models/Transaction.js";//👉 Transaction → payment record
import User from "../models/User.js";//👉 User → credits update
export const stripeWebhooks=async (request,response)=>{//👉 Stripe yaha POST request bhejega
    // Stripe instance
    const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)//👉 backend auth
    // Signature
    const sig=request.headers["stripe-signature"]//👉 Stripe s' signature 👉 it verifies request genuine or not

    let event;
    try {
        // 👉 3 things verify:
        // body (raw)
        // signature
        // webhook secret
        event=stripe.webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
        // 💀 if mismatch:
        // 👉 error throw
        // 👉 request reject
    } catch (error) {
        return response.status(400).send(`Webhook Error:${error.message}`)
    }
    try {
        switch (event.type) {//👉 you can handle different Stripe events
            case "payment_intent.succeeded":
                {
                    const paymentIntent=event.data.object
                    //Session find
                    // 🧠 Why?
                    // 👉 meta data stored in session
                    const sessionList=await stripe.checkout.sessions.list({
                        payment_intent:paymentIntent.id,
                    })
                    const session=sessionList.data[0]//Session extract
                    const {transactionId,appId}=session.metadata//Metadata
                    //💥 SAME metadata which is in purchasePlan :
                    // metadata: {
                    // transactionId,
                    // appId:'quickgpt'
                    // }

                    if(appId==='quickgpt'){//App validation
                        const transaction=await Transaction.findOne({_id:transactionId,isPaid:false })//Find transaction👉 duplicate payment avoid👉 avoid double credits
                        //update credits in user account
                        await User.updateOne({_id:transaction.userId},{$inc:
                            {credits:transaction.credits}})
                        //update credit payment status
                        transaction.isPaid=true;
                        await transaction.save()
                    }
                    else{
                        return response.json({received:true,message:"Ignored event:Invalid app"})
                    }
                    break;
                }
        
            default:
                console.log("Unhandled event type:",event.type)
                break;
        }
        response.json({received:true})
    } catch (error) {
        console.error("webhook processing error:",error)
        response.status(500).send("internal server Error")
    }
}
// 🧠 FULL FLOW (IMPORTANT 💀)
// User → Stripe payment
// ↓
// Stripe → webhook
// ↓
// webhooks.js
// ↓
// transaction find
// ↓
// credits add
// ↓
// done ✅

// 👉 what webhooks.js do?
// payment verify
// transaction check
// credits add
// fraud prevent