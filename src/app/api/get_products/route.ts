// โค้ดนี้เป็นฟังก์ชัน GET ที่ใช้ในการดึงข้อมูลสินค้าจากฐานข้อมูล MongoDB ผ่าน API ของ Next.js 

// นำเข้าฟังก์ชัน connectMongoDB เพื่อใช้ในการเชื่อมต่อกับฐานข้อมูล MongoDB
import { connectMongoDB } from "@/libs/MongoConnect";
// นำเข้าโมดูล Product เพื่อใช้ในการจัดการข้อมูลสินค้าใน MongoDB
import Product from "@/libs/models/Product";
// นำเข้า Next.js functions NextResponse เพื่อใช้ในการสร้าง response ของเซิร์ฟเวอร์
import { NextResponse } from "next/server";

// ประกาศฟังก์ชัน GET โดยไม่มีการรับพารามิเตอร์เพราะไม่ได้ต้องการข้อมูลเพิ่มเติม
export async function GET() {
    try{
        // เรียกใช้ฟังก์ชัน connectMongoDB เพื่อเชื่อมต่อกับฐานข้อมูล MongoDB
        await connectMongoDB()

        // ใช้โมเดล Product เพื่อดึงข้อมูลสินค้าทั้งหมดจากฐานข้อมูล MongoDB โดยใช้ find() ซึ่งจะคืนค่าข้อมูลสินค้า
        const data = await Product.find()

        // ส่ง response ในรูปแบบ JSON โดยระบุข้อมูลสินค้าทั้งหมดที่ดึงมาจากฐานข้อมูล MongoDB กลับไปยัง client
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            {
                error,
                msg: "Something Went Wrong"
            },
            {status: 400}
        )
    }
}