import mongoose from "mongoose";
import Expense from '../models/expenseModal.ts';
import ExpenseLimit from '../models/limitModal.ts'
import dayjs from "dayjs";
import Notification from '../models/notificationModal.ts'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { io } from "../index.ts";
import nodemailer from 'nodemailer'


dayjs.extend(weekOfYear)

type LimitCheckResult = {
   total:{
    daily:number,
    weekly:number,
    monthly:number,
   },
   limit:{
    daily:number | null,
    weekly:number | null,
    monthly:number | null
   },
   exceeded:{
    daily:boolean,
    weekly:boolean,
    monthly:boolean
   }
}

const checkExpenseLimit = async(userId:mongoose.Types.ObjectId)=>{
    try {
        const now = dayjs()
        let startOfDay = now.startOf("day").toDate()
        let endOfDay = now.endOf("day").toDate()

        let startOfWeek = now.startOf("week").toDate()
        let endOfWeek =  now.endOf("week").toDate()

        let startOfMonth = now.startOf("month").toDate()
        let endOfmonth = now.startOf("month").toDate()

        const [daily,weekly,monthly] = await Promise.all([getTotalExpense(userId,startOfDay,endOfDay),getTotalExpense(userId,startOfWeek,endOfWeek),getTotalExpense(userId,startOfMonth,endOfmonth)])

        const limitDoc = await ExpenseLimit.findOne({userId})
        if(!limitDoc){
            return {
                total:{daily,weekly,monthly},
                limit:{daily:null,weekly:null,monthly:null},
                exceeded:{daily:false,weekly:false,monthly:false}
            }
        }

        const result:LimitCheckResult={
            total:{
                daily,
                weekly,
                monthly
            },
            limit:{
                daily:limitDoc?.dailyLimit ?? null,
                weekly:limitDoc?.weeklyLimit ?? null,
                monthly:limitDoc?.monthlyLimit ?? null
            },
            exceeded:{
                daily:limitDoc?.dailyLimit !== null && daily > limitDoc?.dailyLimit,
                weekly:limitDoc?.weeklyLimit !== null && weekly > limitDoc?.weeklyLimit,
                monthly:limitDoc?.monthlyLimit !== null && monthly > limitDoc?.monthlyLimit
            }
        }
         return result
        
    } catch (error) {
        console.log("getTodayTotal error",error)
        return {
                total:{daily:0,weekly:0,monthly:0},
                limit:{daily:null,weekly:null,monthly:null},
                exceeded:{daily:false,weekly:false,monthly:false}
            }
    }
}

const getTotalExpense = async(userId:mongoose.Types.ObjectId,startDate:Date,endDate:Date):Promise<number>=>{
    try {
        const result = await Expense.aggregate([{
            $match:{
                userId,
                date:{$gte:startDate,$lte:endDate}
            }
        },{
            $group:{
                _id:null,
                totalAmount:{$sum:"$amount"}
            }
        }])
        return result.length > 0 ? result[0]?.totalAmount : 0;
    } catch (error) {
        console.log("getTotal Expense Error",error)
        return 0
    }
}

const getPeriodKeys =async(type:"Daily" | "Weekly" | "Monthly")=>{
    const now = dayjs()
    switch(type){
        case "Daily":
            return now.format("YYYY-MM-DD")
        case "Weekly":
            return `${now.year()}-W${now.week()}`
        case "Monthly":
            return now.format("YYYY-MM")
    }
}

const sendExpenseLimitNotificationsOnce=async(
    userId:mongoose.Types.ObjectId,
    type:"Daily"|"Weekly"|"Monthly",
    message:String,
    sendChannels:()=>Promise<void>
)=>{
    const periodKey = await getPeriodKeys(type)
    const exist = await Notification.findOne({userId,periodKey})
    if(!exist){
        await Notification.create({userId,type,message,periodKey})
    }
}


export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NODE_MAILER_ID,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});
export const sendEmail=async(email:string,text:string,subject?:string,html?:string)=>{
const nodemailerOptions = {
      from: `Expense Tracker <${process.env.NODE_MAILER_ID}>`,
      to: email,
      subject: subject,
      text: text,
      html: html,
    };
}



export const sendChannels=async(userId:mongoose.Types.ObjectId,userEmail:string,message:string)=>{
  await sendEmail(userEmail,message)
  io.to(userId.toString()).emit("notification",{
    type:"Daily",
    message:message
  })

}

