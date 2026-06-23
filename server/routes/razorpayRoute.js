import express from 'express'
import authSeller from '../middlewares/authSeller.js'
import authUser from '../middlewares/authUser.js'
import {processPayment , paymentVerification , getKey} from "../controllers/razorpayController.js"

const razorpayRouter = express.Router();

razorpayRouter.post('/payment/process' ,authUser ,  processPayment)
razorpayRouter.get('/getKey' ,authUser ,  getKey)
razorpayRouter.post('/paymentVerification' ,authUser , paymentVerification)

export default razorpayRouter;

