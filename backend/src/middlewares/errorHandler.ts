// import { Request, Response,NextFunction } from "express";
import express, { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../utils/AppError.ts";

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