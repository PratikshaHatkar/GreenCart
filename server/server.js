import cookieParser from "cookie-parser";
import  express  from "express";
import Razorpay from "razorpay";
import cors from 'cors'

import connectDB from "./configs/db.js";
import 'dotenv/config'
import dotenv from 'dotenv'


import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import razorpayRouter from "./routes/razorpayRoute.js";
import { v2 as cloudinary } from 'cloudinary';

//razorpay
// dotenv.config({ path:  './server/.env' });


dotenv.config();

const app = express()
const port = process.env.PORT || 4000

await connectDB()
await connectCloudinary()

app.use(express.urlencoded({ extended: true }));

// Razorpay Instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


//Allow multiple origins
const  allowedOrigins = ['http://localhost:5173']
//Middlerware configuration
app.use(express.json()) // all the req pass through json 
app.use(cookieParser())
app.use(cors({origin:  allowedOrigins, credentials:true}))


app.get('/' , (req , res)=> res.send("API is working"));
app.use('/api/user' , userRouter)
app.use('/api/seller' , sellerRouter)
app.use('/api/product' , productRouter)
app.use('/api/cart' , cartRouter)
app.use('/api/address' , addressRouter)
app.use('/api/order' , orderRouter)
app.use("/api/v1" , razorpayRouter)


app.listen(port , ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})

export default app;