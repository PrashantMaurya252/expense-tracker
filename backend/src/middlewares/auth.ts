import {type NextFunction,type Request,type Response } from "express";
import { AppError } from "../utils/AppError.ts";
import jwt from "jsonwebtoken";
import User from "../models/userModal.ts";
import type { IUser } from "../models/userModal.ts";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.authToken;
    // console.log("token in middleware",token)
    if (!token) {
      // throw new AppError("No token provided", 401);
      res.status(401).json({success:false,status:401,message:"No token provided"})
      return
    }

    const decoded = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as { userId: string; email: string };

    if (!decoded) {
      // throw new AppError("Invalid token", 401);
      res.status(401).json({success:false,status:401,message:"Invalid Token"})
      return
    }

    // console.log(decoded,decoded.email)

    const user = await User.findOne({ email: decoded.email }) as IUser;
    if (!user) {
      // throw new AppError("Unauthorized", 401);
      res.status(401).json({success:false,status:401,message:"Unauthorized"})
      return
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };

    req.user = payload;
    console.log("user in auth middleware",req.user)
    next();
  } catch (error:any) {
    console.log(error.message)
    res.status(500).json({success:false,message:"Something went wrong",error:error.message})
    // throw new AppError("Unauthorized", 401,error.message);
  }
};
