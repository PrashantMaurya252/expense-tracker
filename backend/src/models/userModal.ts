import mongoose, { Document } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'

 export interface IUser extends Document{
    _id: mongoose.Types.ObjectId;
    name:string,
    email:string,
    password:string,
    isVerified:boolean,
    googleId:string,
    otp:string | null,
    otpExpiresAt:Date | null,
    modeOfSignup:string,
    otpLastSent?:Date,
    avatar?:string,
    generateToken:()=>string,
    verifyToken:(token:string)=>any,
    checkPassword:(userPassword:string)=>Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:function(){
            return !this.googleId
        }
        
    },
    avatar:String,
    isVerified:{
        type:Boolean,
        default:false
    },
    googleId:{
        type:String,
        default:null
    },
    otp:Number,
    otpExpiresAt:Date,
    otpLastSent:Date,
    modeOfSignup:{
        type:String,
        enum:["Email","Google"],
        required:true,
        default:"Email"
    }
},{
    timestamps:true
})


userSchema.methods.generateToken=async function(){
    const payload ={
        name:this.name,
        email:this.email,
        _id:this._id
    }
return jwt.sign(payload,process.env.JWT_SECRET as string,{expiresIn:'1d'})
}
userSchema.methods.verifyToken=async function(token:string){
    return jwt.verify(token,process.env.JWT_SECRET as string)    
}

userSchema.methods.checkPassword = async function(userpassword:string){
    return bcrypt.compare(userpassword,this.password)
}
userSchema.pre('save',async function(next){
    if(!this.isModified("password")) return next()

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})


const User = mongoose.model<IUser>("User",userSchema)
export default User;
