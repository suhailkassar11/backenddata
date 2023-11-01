import User from "../model/userModel.js";
import JWT from 'jsonwebtoken';
export const requireSignIn=async(req,res,next)=>{
    try {
        const decode= await JWT.verify(req.headers.authorization,process.env.JWT_SECRET_KEY)
        req.user=decode
        next()
    } catch (error) {
        console.log(error)
    }
}

export const isAdmin=async(req,res,next)=>{
    try {
        const user=await User.findById(req.user._id)
        if( user.role!=1){
            return res.status(401).send({
                success:false,
                message:"you are not admin"
            })
        }
        else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}


