//ฟังก์ชัน connectMongoDB ในโค้ดของคุณใช้เพื่อเชื่อมต่อกับฐานข้อมูล MongoDB โดยใช้ Mongoose

import mongoose from "mongoose";

export const connectMongoDB = async () => {
    if(mongoose.connection.readyState === 1){
        return mongoose.connection.asPromise()
    }

    return await mongoose.connect(process.env.MONGO_URI!)
}