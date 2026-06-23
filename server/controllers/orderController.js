
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import stripe from "stripe"

export const placeOrderRazorpay = async (req,res)=>{
    try{
        const {userId,items,address}=req.body;

        let amount = await items.reduce(async(acc,item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        },0);

        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"Online"
        });
        

        res.json({
            success:true,
            amount,
            orderId:order._id
        });
        // return res.json({success:true , message:"Order Placed Successfully"})

    }catch(error){
        res.json({
            success:false,
            message:error.message
        });
    }
}

//Place Order COD : /api/order/cod
export const placeOrderCOD = async (req , res)=>{
    try{
        const {userId , items , address} = req.body;
        if(!address || items.length === 0){
            return res.json({success:false , message:"Invalid data"})
        }
            //Calculate Amout Using Items
            let amount = await items.reduce(async (acc , item)=>{
                const product = await Product.findById(item.product);
                return (await acc) + product.offerPrice * item.quantity;
            } , 0)

            //Add Tax Charge (2%)
            amount += Math.floor(amount * 0.02);

            await Order.create({
                userId , 
                items,
                amount,
                address,
                paymentType:"COD",
            }) 
            return res.json({success:true , message:"Order Placed Successfully"})
    }
    catch(error){
        res.json({success:false , message:error.message})
    }
}

//Get orders by User ID : /api/order/user
export const getUserOrders = async (req ,res)=>{
    try{
        const userId = req.userId;
        const orders = await Order.find({
            userId , 
            $or:[{paymentType:"COD"} , {isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1});
        res.json({success:true , orders})
    }
    catch(error){
        res.json({success:false , message:error.message})
    }
}

//Get All orders for seller : /api/order/seller
export const getAllOrders = async (req ,res)=>{
    try{
        const orders = await Order.find({ 
            $or:[{paymentType:"COD"} , {isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1});;
        res.json({success:true , orders})
    }
    catch(error){
        res.json({success:false , message:error.message})
    }
}