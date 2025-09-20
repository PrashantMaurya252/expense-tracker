import mongoose from "mongoose";

const connectToDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI as string)
    console.log(`MongoDB connected at host ${connect.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection error',error)
        process.exit(1)
    }
    
}

export default connectToDB