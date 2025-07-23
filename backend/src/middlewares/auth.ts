import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.ts";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModal.ts";

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError("No token provided", 401);
    }

    const decoded = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as { userId: string; email: string };

    if (!decoded) {
      throw new AppError("Invalid token", 401);
    }

    const user = await User.findOne({ email: decoded.email }) as IUser;
    if (!user) {
      throw new AppError("User not found", 401);
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
    };

    req.user = payload;
    next();
  } catch (error) {
    throw new AppError("Unauthorized", 401);
  }
};
