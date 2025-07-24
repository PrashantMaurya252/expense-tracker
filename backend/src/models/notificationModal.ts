import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:["Daily","Weekly","Monthly","OTP","General"],
        required:true,
    },
    message:{type:String,required:true},
    isRead:{type:Boolean,default:false},
    timeStamp:{type:Date,default:Date.now},
    periodKey:{type:String}
},{timestamps:true})

export default mongoose.model("Notification",notificationSchema)