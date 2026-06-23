//razorpay
import { instance } from "../server.js"
import crypto from "crypto"
import Order from "../models/Order.js"

export const processPayment = async(req , res)=>{
    const options={
        amount:Number(req.body.amount * 100),
        currency:"INR"
    }
    const order = await instance.orders.create(options)
    res.status(200).json({
        success:true,
        order
    })
}
export const getKey = async(req , res)=>{
    res.status(200).json({
        key:process.env.RAZORPAY_API_KEY
    })
}

export const paymentVerification = async(req,res)=>{

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature =
      crypto
      .createHmac(
         "sha256",
         process.env.RAZORPAY_API_SECRET
      )
      .update(body)
      .digest("hex");

    if(expectedSignature === razorpay_signature){

        await Order.findByIdAndUpdate(
            orderId,
            {isPaid:true}
        );

        return res.json({
            success:true
        });
    }

    return res.status(400).json({
        success:false
    });
}
