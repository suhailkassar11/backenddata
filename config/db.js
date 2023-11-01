import mongoose from "mongoose";
import {data} from "../data/data.js"
import Product from "../model/productModel.js"

const connectDB=async()=>{
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log(`connected with database`)
    //   Product.insertMany(data)
    } catch (error) {
        console.log(`error in mongodb ${error}`)
    }
}

export default connectDB;