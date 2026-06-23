import Product from "../models/Product.js";
import { v2 as cloudinary } from 'cloudinary'


// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);

    const images = req.files || [];

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
          console.log(item)
        try {
          console.log("Uploading:", item.path);

          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "auto",
          });

          console.log("result:", result);
          console.log("Upload Success:", result.secure_url);

          return result.secure_url;
        } catch (error) {
          console.log("========== CLOUDINARY ERROR ==========");
          console.dir(error, { depth: null });

          // Throw error to outer catch block
          throw error;
        }
      })
    );

    console.log("Images URL:", imagesUrl);
    console.log("Product Data:", productData);

    const product = await Product.create({
      ...productData,
      image: imagesUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product Added",
      product,
    });
  } catch (error) {
    console.log("========== MAIN ERROR ==========");
    console.dir(error, { depth: null });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// Get Product : /api/product/list
export const productList = async (req , res)=>{
    try{
        const products = await Product.find({}) //all product
        res.json({success:true , products})
    }
    catch(error){
        console.log(error.message);
        res.json({success:false , message:error.message})
    }
}

// Get single Product : /api/product/id
export const productById = async (req , res)=>{
    try{
        const {id} = req.body;
        const product = await Product.findById(id)
        res.json({success :true , product})
    }
    catch(error){
        console.log(error.message);
        res.json({success:false , message:error.message})
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req , res)=>{
    try{
        const {id , inStock} = req.body;
        await Product.findByIdAndUpdate(id , {inStock})
        res.json({success :true , message:"Stock Updated"})
    }
    catch(error){
        console.log(error.message);
        res.json({success:false , message:error.message})
    }

}