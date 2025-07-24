import mongoose from "mongoose";

export interface Expense{
    userId:mongoose.Types.ObjectId,
    title:string,
    category:string,
    description:string | null,
    amount:number,
    date:Date | null
}

export const expenseCategories = ["Travel","Food","Rent&Bills","Shopping","Others"] as const

const expenseSchema = new mongoose.Schema<Expense>({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:expenseCategories,
        required:true
    },
    description:{
        type:String,
        default:null
    },
    amount:{
        type:Number,
        required:true,
        min:[0,"amount must be positive"]
    },
    date:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true})

export default mongoose.model("Expense",expenseSchema)