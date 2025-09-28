import { z } from "zod"
import { AppError } from "../utils/AppError.ts";
import {type Request,type Response } from "express";
import Expense from '../models/expenseModal.ts';
import dayjs from "dayjs";
import {Parser} from 'json2csv'
import PDFDocument from 'pdfkit'
import { success } from "zod/v4";


const categoryEnum = z.enum(["Travel", "Food", "Rent&Bills", "Shopping", "Others"]);

const addExpenseSchema = z.object({
   title:z.string(),
   description:z.string(),
   category:categoryEnum,
   amount:z.number()
})


export const addExpense = async(req:Request,res:Response)=>{
    try {
        const userId = req.user!.userId
        console.log(userId,"USerId")
        const parsed = addExpenseSchema.safeParse(req.body)

        if(!parsed.success){
            const errors = parsed.error
            res.status(400).json({success:false,message:"Something is missing"})
            return
            // throw new AppError("Something is missing", 400,errors);
        }

        const {title,description,category,amount} = parsed.data

        const expense = await Expense.create({
            userId,title,description,amount,category
        })
        res.status(200).json({
            success:true,
            message:"Expense created successfully",
            expense
        })
    } catch (error:any) {
        res.status(400).json({success:false,message:"Add Expense Not Working",error:error.message})
        // throw new AppError("Add Expense Error", 500,error.message);
    }
}

const updateExpenseSchema =z.object({
    title:z.string(),
    description:z.string(),
    amount:z.number().gt(0),
    category:categoryEnum
}).partial()


export const updateExpense=async(req:Request,res:Response)=>{
    try {
        const userId = req.user!.userId
        const parsed = updateExpenseSchema.safeParse(req.body)
        const expenseId = req.params

        const expense = await Expense.findOne({userId,_id:expenseId})

        if(!expense){
            throw new AppError("Expense is not available", 404);
        }

        if(!parsed.success){
            const errors = parsed.error
            throw new AppError("Validation failed", 400,errors);
        }

        const {title,description,category,amount} = parsed.data

        if(title) expense.title = title
        if(description) expense.description = description
        if(amount) expense.amount = amount
        if(category) expense.category = category

        await expense.save()

        res.status(200).json({
            success:true,
            message:'Expense Updated Successfully'
        })
    } catch (error:any) {
        throw new AppError("Update Expense Error", 500,error.message);
    }
}

export const deleteExpense=async(req:Request,res:Response)=>{
    try {
        const userId = req.user!.userId
        const {expenseId} = req.params

        const deletedExpense = await Expense.findOneAndDelete({userId,_id:expenseId})

        if(!deletedExpense){
            throw new AppError("Can't find this this expense", 404);
        }

        return res.status(200).json({
            success:true,
            message:"Expense Deleted successfully"
        })

    } catch (error:any) {
        throw new AppError("Delete Expense Error", 500,error.message);
    }
}

export const getExpenseById =async(req:Request,res:Response)=>{
    try {
        const userId = req.user!.userId
        const {expenseId} = req.params

        const expense = await Expense.findOne({userId,_id:expenseId})
        if(!expense){
            throw new AppError("Can't find this this expense", 404);
        }

        return res.status(200).json({
            success:true,
            message:"You get this expense successfully",
            expense
        })
    } catch (error:any) {
        throw new AppError("getExpenseById Error", 500,error.message);
    }
}



export const getAllExpenses = async(req:Request,res:Response)=>{
    try {
        const userId = req.user!.userId
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page -1)*limit

        const {category,minAmount,maxAmount,startDate,endDate,search} = req.query

        const filter:any = {userId}

        const start = startDate ? new Date(startDate as string) : dayjs().subtract(1,"month").toDate()
        const end = endDate ? new Date(endDate as string) : new Date()
        filter.date={$gte:start,$lte:end}

        if(category) filter.category = category

        if(minAmount || maxAmount){
            filter.amount={}

            if(minAmount) filter.amount.$gte=parseFloat(minAmount as string)
            if(maxAmount) filter.amount.$lte=parseFloat(maxAmount as string)
        }

        const expenses = await Expense.find(filter).sort({date:-1}).skip(skip).limit(limit)

        const totalCount = await Expense.countDocuments(filter)

        const aggregation = await Expense.aggregate([
            {$match:filter},
            {
                $group:{
                    _id:"$category",
                    totalAmount:{$sum:"$amount"},
                    count:{$sum:1},
                },
            },
        ])

        const totalAmount = aggregation.reduce((acc:number,curr:{totalAmount:number})=> acc+ curr.totalAmount,0)

        const categorywise = aggregation?.map((item:{_id:string,totalAmount:number,count:number})=>({
            category:item._id,
            totalAmount:item.totalAmount,
            count:item.count
        }))

        return res.status(200).json({
            data:expenses,
            pagination:{
                page,
                limit,
                totalAmount,
                totalPages:Math.ceil(totalCount/limit)
            },
            categorySummary:categorywise
        })

        // const expenses = await Expense.find({userId})
    } catch (error:any) {
        throw new AppError("getAllExpenses Error", 500,error.message);
    }
}

export const exportExpenses=async(req:Request,res:Response)=>{
    try {
        const userId = req.user!.userId

        const {category,minAmount,maxAmount,startDate,endDate,format='csv'} = req.query

        const filter:any = {userId}
        if(category) filter.category = category

        if(minAmount || maxAmount){
        filter.amount ={}
        if(minAmount) filter.amount.$gte=parseFloat(minAmount as string)
        if(maxAmount) filter.amount.$gte=parseFloat(maxAmount as string)
        }
        
        
        const start = startDate ? new Date(startDate as string) : dayjs().subtract(1,"month").toDate()
        const end = endDate ? new Date(endDate as string) :new Date()
        filter.date= {$gte:start,$lte:end}

        const expenses = await Expense.find(filter).sort({date:-1}) 

        if(format === 'csv'){
            const parser = new Parser({fields:["date","title","category","amount","description"]})
            const csv = parser.parse(expenses)
            res.header("Content/Type","text/csv");
            res.attachment("expenses.csv")
            return res.send(csv)
        }

        if(format === 'pdf'){
            const doc = new PDFDocument()

            res.setHeader("Content/Type","application/pdf");
            res.setHeader("Content-Disposition",'attachment; filename="expense.pdf"')
            doc.pipe(res)
            doc.fontSize(16).text("Expense Report\n\n")

            expenses?.forEach((e,i)=>{
                doc.fontSize(12).text(`${i+1}.${e.title}-${e.category}-${e.amount}-${e.description}-${e.date}`)
            })
            doc.end()
        }
    } catch (error:any) {
        throw new AppError("export Expenses Error", 500,error.message);
    }
}