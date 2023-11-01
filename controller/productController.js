import Product from "../model/productModel.js"
import slugify from "slugify"
import fs from "fs";

import braintree from 'braintree';
import orderModel from "../model/orderModel.js";
import dotenv from 'dotenv'

dotenv.config()

var gateway = new braintree.BraintreeGateway ({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

export const CreateProductController=async(req,res)=>{
    try {
        const {name,brand,gender,category,price,items_left}=req.body;

        const {imageURL}=req.body;

        switch(true){
            case !name:
                return res.status(500).send({error:"name is required"})
            case !brand:
                return res.status(500).send({error:"brand is required"})
            case !gender:
                return res.status(500).send({error:"gender is required"})
            case !category:
                return res.status(500).send({error:"category is required"})
            case !price:
                return res.status(500).send({error:"price is required"})
            case !items_left:
                return res.status(500).send({error:"items_left is required"})
            case !imageURL:
                return res.status(500).send({error:"image is required"})
        }

        const products=new Product({
            ...req.body,
            name,
            brand,
            gender,
            category,
            price,
            items_left,
            imageURL,
            slug:slugify(name)}).save();

       
        res.status(201).send({
            success:true,
            message:"product created successfully",
            products
        })
        
    } catch (error) 
    {
        console.log(error)
        res.status(404).send({
            success:false,
            message:"error in creating  products",
            error
        })
    }
}

export const GetProductController=async(req,res)=>{
    try {
        const products=await Product.find({}).sort({createdAt:-1})
        const total = await Product.countDocuments();

        res.status(200).send({
            total,
            success:true,
            message:"successfully getting the products",
            products,
            
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success:false,
            message:"error in getting the products",
            error
        })
    }
}

export const singleProductController=async(req,res)=>{
    try {
        const products=await Product.findOne({slug:req.params.slug}).populate("category").select("-imageURL").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success:true,
            message:'successfully getting the products',
            products
        })
        
        
    } catch (error) {
        console.log(hello)
        return res.status(500).send({
            success: false,
            message: "Error while fetching the single product.",
            error
        })
        
    }
}


export const UpdateProductController=async(req,res)=>{
    try {
        const id=req.params.id
        const updateData = req.body;
        const updateProduct=await Product.findByIdAndUpdate(id,updateData,{new:true})
        if (!updateProduct) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        return res.status(200).send({ success: true, message: 'Product updated successfully', product: updateProduct });
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error updating product",
            error
        })
    }
}

export const DeleteProductController=async(req,res)=>{
    try {
        const products=await Product.findByIdAndDelete(req.params.id).select("-imageURL");
        res.status(200).send({
            success:true,
            message:'successfully deleted the product',
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error deleting product",
            error
        })
    }
}

export const BraintreeTokenController=(req,res)=>{
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.send(response);
            }
          });
        
    } catch (error) {
        console.log(error)
    }
}
export const BraintreePaymentController=async(req,res)=>{
    try {
        const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
    } catch (error) {
        console.log(error)
    }
}