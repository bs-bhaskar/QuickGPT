import express, { Router } from "express"//for creating routes
// Import controllers
import { getPlans, purchasePlan } from "../controllers/creditController.js"// actual logic in controllers
// Import middleware
import {protect} from "../middlewares/auth.js"//👉 🔐 auth check
//Router create
const creditRouter=express.Router()//👉 mini route system
creditRouter.get('/plan',getPlans)
// 🧠 Flow:
// GET /api/credit/plan
// 👉 no auth required
// 👉 every one shoud se plans
// user login or not → plans should show
creditRouter.post('/purchase', protect,purchasePlan)
// 🧠 Flow:
// POST /api/credit/purchase
// → protect
// → purchasePlan controller
// 👉 only logged-in user should buy plan
export default creditRouter

// 🧠 FULL FLOW (IMPORTANT 💀)
// Frontend:
// axios.get('/api/credit/plan')
// ↓
// server:
// /api/credit/plan
// ↓
// controller:
// getPlans()
// ↓
// plans return
// 💳 Purchase Flow
// Frontend:
// axios.post('/api/credit/purchase')
// ↓
// protect middleware (token check)
// ↓
// purchasePlan()
// ↓
// Stripe session create
// ↓
// URL return
// ↓
// frontend redirect

// 👉 what creditRoutes do?
// plans fetch
// payment start
// auth protect