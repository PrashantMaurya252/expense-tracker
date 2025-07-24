import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import connectToDB from "./utils/db";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import winston from "winston";
import morgan from 'morgan'
import createHttpError from "http-errors";
import http from 'http'
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app)

const io = new Server(server,{
  cors:{
    origin:"*"
  }
})

io.on("connection",(socket)=>{
  console.log("User Connected",socket.id)
  socket.on("join",(userId)=>{
    socket.join(userId)
  })
})

export {io}

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(xss());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const logger = winston.createLogger({
    level:'info',
    format:winston.format.json(),
    transports:[
        new winston.transports.File({filename:'error.log',level:'error'}),
        new winston.transports.File({filename:'combined.log'})
    ]

})

if(process.env.NODE_ENV !== 'production'){
    logger.add(new winston.transports.Console({
        format:winston.format.simple()
    }))
}

app.use(morgan('combined',{stream:{write:(msg:string)=>logger.info(msg.trim())}}))

app.use((req,res,next)=>{
    next(createHttpError(404,"Not Found"))
})

app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
    logger.error(err.stack || err)
    res.status(err.status || 500).json({
        status:'error',
        message:err.message || "Internal Server Error"
    })
})

const PORT = process.env.PORT;

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB");
  });
