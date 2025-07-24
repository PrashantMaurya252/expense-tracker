import mongoose from "mongoose";

//types/express/index.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: mongoose.Types.ObjectId;
        email: string;
      };
    }
  }
}

export {};
