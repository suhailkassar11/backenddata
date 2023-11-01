import mongoose from "mongoose";

const orderSchema=new mongoose.Schema(
    {
        producsts:[{
            type:mongoose.ObjectId,
            ref:"Product"
        }],
        payment:{},
        buyer:{
            type:mongoose.ObjectId,
            ref:'User'
        },
        status:{
            type:String,
            default:"Not Process",
            enum:['Not Process','processed','shipped','delivered','cancel'],
        }
    },
    {timestamps:true}

)
export default mongoose.model('Order',orderSchema)

