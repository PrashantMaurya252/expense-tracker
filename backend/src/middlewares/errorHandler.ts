import { Request, Response, NextFunction,ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler=(
    err:Error | AppError,
    req:Request,
    res:Response,
    next:NextFunction
):void=>{
    if(err instanceof AppError){
         res.status(err.statusCode).json({
            success:false,
            message:err.message,
            error:err.errors || null
        })
    }
    console.error(err)
     res.status(500).json({
        success:false,
        message:"Internal Server Error"
    })
}