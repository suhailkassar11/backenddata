import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authRoute from './routes/authRoute.js';
import productRoute from './routes/productRoute.js';


dotenv.config()
connectDB()
const app=express()
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use(bodyParser.json())

//set up routes
app.use('/api/auth',authRoute)
app.use('/api/product',productRoute )



const PORT=process.env.PORT ||9000
app.listen(PORT,()=>console.log(`server is run on port ${PORT}`))