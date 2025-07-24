import mongoose from "mongoose";

const limitSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    dailyLimit:{type:Number,default:null,min:0},
    weeklyLimit:{type:Number,default:null,min:0},
    monthlyLimit:{type:Number,default:null,min:0},
},{timestamps:true})

export default mongoose.model("ExpenseLimit",limitSchema)