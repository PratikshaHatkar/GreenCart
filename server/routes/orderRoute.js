import express from 'express'
import {placeOrderCOD , placeOrderRazorpay , getUserOrders , getAllOrders} from '../controllers/orderController.js'
import authSeller from '../middlewares/authSeller.js'
import authUser from '../middlewares/authUser.js'

const orderRouter = express.Router();

orderRouter.post("/cod" , authUser , placeOrderCOD)
orderRouter.post("/razorpay" , authUser , placeOrderRazorpay)
orderRouter.get("/user" , authUser , getUserOrders)
orderRouter.get("/seller" , authSeller , getAllOrders)

export default orderRouter;
