import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    Name:{type:String,required:true},
    Email:{type:String,required:[true,'Please add an email']},
    Password:{type:String,required:[true,'Please add a password']},
    role:{
        type:Number,
        default:0,
    },
    image:{
        data:Buffer,
        contentType: String 
    }
}
,
{
    timestamps : true
})

const User=new mongoose.model('User',userSchema);
export default User;
