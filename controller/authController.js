import {comparePassword, hashPassword } from "../helpers/authHelper.js";
import fs from 'fs';
import User from "../model/userModel.js";
import JWT from 'jsonwebtoken';

export const RegisterController=async(req,res)=>{
    try {

        const {Name,Email,Password}= await req.body
        const {image}=req.body
        if (!Name){
            return res.status(401).send({
                message:"please enter name"
            })
        }
        if (!Email){
            return res.status(401).send({
                message:"please enter email"
            })
        }
        if (!Password){
            return res.status(401).send({
                message:"please enter password"
            })
        }
        if (image && image.size>1000000)
            return res.status(500).send({error:"photo is required and should be less than 1 mb"})

        const existingUser=await User.findOne({Email})
        if(existingUser){
            return res.status(200).send({
                success:true,
                message:"user already exist please login"
            })
        }

        const hashPass=await hashPassword(Password)

        const user= await new User({
            Name,
            Email,
            Password:hashPass,
            image,
        })
        if(image){
            user.image.data=fs.readFileSync(image.path)
            user.photo.contentType=image.type
        }
        await user.save();
        res.status(201).send({
            success:true,
            message:"register successfully",
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(501).send({
            success:false,
            message:"error in regisering the user",
        })
    }
}


export const Login=async(req,res)=>{
    try {
        const {Email,Password}=await req.body
        if(!Email||!Password){
            return res.status(200).send({
                success: false,
                message:'please enter right email and password'
            })
        }
        const user = await User.findOne({Email})
        if(!user){
            return res.status(200).send({
                success: false,
                message:'wrong Email'
            })
        }
        const match=await comparePassword(Password,user.Password);
        if (!match){
            return res.status(400).send({
                success:false ,message:'Wrong Password'
            })
        }

        const token =await JWT.sign({_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
        res.status(200).send({
            success:true,
            message:"login successfully enjoy",
            user:{
                Name:user.Name,
                Email:user.Email,
                role:user.role,
                token,
            },
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'login failed',
            error
        })
    }
}

export const testController=(req,res)=>{
    try {
        res.send("protected route")
    } catch (error) {
        error
    }
}

export const GetUser=async(req,res)=>{
    try {
        const users=await User.find({})
        const total=await User.countDocuments();
        const admin=await User.find({role:1}).countDocuments();
        const totalUsers=total-admin;
        res.status(200).send({
            totalUsers,
            success:true,
            message:"successfully getting the users",
            users,
            
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'get user info failed',
            error
        })
    }
}