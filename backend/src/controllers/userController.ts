import {type Request,type Response } from "express";
import User from "../models/userModal.ts";
import { AppError } from "../utils/AppError.ts";
import { z } from "zod";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { nextTick } from "process";

const signUpSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(6, "password must be atleast 6 characters"),
});

export const userEmailSignUp = async (req: Request, res: Response):Promise<void> => {
  try {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.format();
      // console.log("error",errors)
       res.status(400).json({success:false,status:400,message:"Validation Failed"})
       return
      // throw new AppError("Validation failed", 404, errors);
    }
    const { name, email, password } = parsed.data;
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist && !isEmailExist.googleId) {
      console.log("This email already exist, try another email")
       res.status(400).json({success:false,status:400,message:"This email already exist, try another email"})
       return
      // throw new AppError("This email already exist, try another email", 403);
    } else if (isEmailExist && isEmailExist.googleId) {
       res.status(400).json({success:false,status:400,message:"This email already exist, try another email"})
       return
      // throw new AppError(
      //   "This Email is registered with Google,Please login with google",
      //   403
      // );
    }

    const newUser = await User.create({
      name,
      password,
      email,
    });

    const token = await newUser.generateToken();

      res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        userId: newUser._id,
        name: newUser.name,
        token,
        tokenExpiresIn: "1d",
      },
    });
  } catch (error: any) {
    console.log("signup Error",error.message)
    // throw new AppError("userEmail Signup Error", 500, error.message);
      res.status(500).json({success:false,status:500,message:"Internal Server Error"})
    //  res.json({status:400,message:"SignUp Failed",success:false})
    // next()
  }
};

export const verification =async(req:Request,res:Response)=>{
  try {
    const email = req.body
    const user = await User.find({email}).select("-password")
    if(!user){
      return res.status(404).json({success:false,message:"User not found"})
    }
    res.status(200).json({
      success:true,
      user
    })
  } catch (error:any) {
    throw new AppError("user verification error",500,error.message)
  }
}

const loginschema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be 6 character long"),
});

export const userEmailSignIn = async (req: Request, res: Response):Promise<void> => {
  try {
    const parsed = loginschema.safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error.format();
      // throw new AppError("login validation failed", 400, errors);
      res.status(400).json({success:false,status:400,message:"Validation Failed"})
      return
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      // throw new AppError("Invalid credentials", 400);
      res.status(400).json({success:false,status:400,message:"Invalid Credentials"})
      return
    }
    if (user && user.googleId) {
      // throw new AppError(
      //   "This email is already present with Google, Please login with google",
      //   403
      // );
      res.status(403).json({success:false,status:403,message:"This email is already present with Google, Please login with google"})
      return
    }

    const checkPassword = await user.checkPassword(password);
    if (!checkPassword) {
      // throw new AppError("Invalid credentials", 400);
      res.status(400).json({success:false,status:400,message:"Invalid Credentials"})
      return
    }

    const token = await user?.generateToken();
     res.status(201).json({
      success: true,
      message: "User LoggedIn successfully",
      data: {
        userId: user._id,
        name: user.name,
        token,
        tokenExpiresIn: "1d",
        modeOfLogin: user.modeOfSignup,
      },
    });
  } catch (error: any) {
    // throw new AppError("userEmail Login Error", 500, error.message);
    res.status(500).json({success:false,status:500,message:"userEmail Login Error"})
  }
};

const resetPasswordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const userEmail = req.user!.email;
    const parsed = resetPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error.format();
      throw new AppError("Invalid format", 400, errors);
    }

    const { oldPassword, newPassword } = parsed.data;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new AppError("Invalid credentials", 400);
    }
    if (user && user.googleId) {
      throw new AppError(
        "You are not authorized to reset password,Please user login"
      );
    }

    const isPasswordCorrect = await user.checkPassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new AppError("Old Password is incorrect", 400);
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User Pasword updated successfully",
    });
  } catch (error: any) {
    throw new AppError("Reset Password Error", 500, error.message);
  }
};

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NODE_MAILER_ID,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const now = Date.now();
    const RESEND_INTERVAL = 5 * 60 * 1000;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found for provided email", 400);
    }
    if (
      user?.otpLastSent &&
      now - user?.otpLastSent.getTime() < RESEND_INTERVAL
    ) {
      const remaining = Math.ceil(
        (RESEND_INTERVAL - (now - user.otpLastSent.getTime())) / 1000
      );
      throw new AppError(
        `Please wait ${remaining} seconds before resending the otp`,
        429
      );
    }

    if (user.googleId) {
      throw new AppError(
        "This email is already login with Google, please Login with Google",
        400
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp.toString();
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.otpLastSent = new Date(Date.now());
    await user.save();

    const nodemailerOptions = {
      from: `Expense Tracker <${process.env.NODE_MAILER_ID}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password is ${otp}: It is valid for 5 minutes`,
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p><p>It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(nodemailerOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent succesfully on given email",
    });
  } catch (error: any) {
    throw new AppError("Forgot Password Error", 500, error.message);
  }
};

const resetPasswordOTPSchema = z.object({
  email: z.string().email("Invalid Email"),
  otp: z.string().min(6, "Minimum 6 digits required"),
  newPassword: z.string().min(6, "atleast 6 character required"),
});
export const resetPasswordWithOTP = async (req: Request, res: Response) => {
  try {
    const parsed = resetPasswordOTPSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid request", 400);
    }
    const { email, otp, newPassword } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found for provided email", 400);
    }
    if (user.googleId) {
      throw new AppError(
        "This email is already present with Google, Please login with Google to continue",
        400
      );
    }

    if (!user.otp || !user.otpExpiresAt) {
      throw new AppError("OTP not received", 400);
    }

    const otpCheck = otp === user.otp;
    const otpNotExpired = user.otpExpiresAt.getTime() < Date.now();

    if (!otpCheck || otpNotExpired) {
      throw new AppError("OTP is invalid or expired", 400);
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    throw new AppError("Reset Password OTP Error", 500, error.message);
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

    const { idToken } = req.body;
    if (!idToken) {
      throw new AppError("Google Id Token required", 400);
    }

    // verify Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email_verified) {
      throw new AppError("Invalid Google Id Token", 400);
    }

    const { email, picture, sub, name } = payload;

    let user = await User.findOne({ email });
    if (user && !user.googleId) {
      throw new AppError("Email already exist with password", 400);
    }

    if (!name) {
      throw new AppError("Google account name is missing", 400);
    }

    if (!user) {
      user = await User.create({
        email,
        name,
        avatar: picture,
        googleId: sub,
      });
    } else {
      user.name = name;
      user.avatar = picture;
      await user.save();
    }
    user.modeOfSignup = "Google";
    await user.save();

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: "Google Login Successful",
      token,
      data: {
        userId: user._id,
        name: user.name,
        token,
        tokenExpiresIn: "1d",
      },
    });
  } catch (error) {
    throw new AppError("Google Auth Error", 500);
  }
};

export const sendOTPLogin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(
        "No User exist with provided email, Please SignUp first",
        400
      );
    }
    if (user.googleId) {
      throw new AppError(
        "This user alredy exist, Please Login with google with this email",
        400
      );
    }

    const now = Date.now();
    if (user.otpLastSent && now - user.otpLastSent.getTime() < 60 * 1000) {
      throw new AppError(
        "Please wait for 1 minute before sending OTP again",
        500
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(now + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = expires;
    user.otpLastSent = new Date(now);

    await user.save();
    const nodemailerOptions = {
      from: `Expense Tracker <${process.env.NODE_MAILER_ID}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password is ${otp}: It is valid for 5 minutes`,
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p><p>It is valid for 5 minutes.</p>`,
    };
    await transporter.sendMail(nodemailerOptions);

    res.status(200).json({
      success: true,
      message: `Login OTP sent to provided email ${email}`,
    });
  } catch (error) {
    throw new AppError("Send OTP Login Error", 500);
  }
};

const verifyOTPSchema = z.object({
  email: z.string().email("Not a valid email"),
  otp: z.string().min(6, "6 numbers required"),
});

export const verifyOTPLogin = async (req: Request, res: Response) => {
  try {
    const parsed = verifyOTPSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error;
      throw new AppError("Validation failed", 400, errors);
    }

    const { email, otp } = parsed.data;
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("Email is incorrect, No user found", 400);
    }

    if (user.googleId) {
      throw new AppError(
        "This user already present with Google, Please login with google ",
        400
      );
    }

    if (!user.otp || !user.otpExpiresAt) {
      throw new AppError("OTP not found or expired", 400);
    }

    const isOtpVerified = otp === user?.otp;
    const isOTPExpired = Date.now() > user.otpExpiresAt?.getTime();

    if (!isOtpVerified || isOTPExpired) {
      throw new AppError("OTP is either invalid or expired", 400);
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = user.generateToken();
    res.status(201).json({
      success: true,
      message: "OTP Login Successful",
      token,
      data: {
        userId: user._id,
        name: user.name,
        token,
        tokenExpiresIn: "1d",
      },
    });
  } catch (error) {
    throw new AppError("Verify OTP Login Error", 500);
  }
};
