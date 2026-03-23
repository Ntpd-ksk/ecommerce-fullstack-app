// โค้ดนี้เป็นฟังก์ชัน POST ที่ใช้ในการเพิ่มข้อมูลสินค้าใหม่ลงในฐานข้อมูล MongoDB ผ่าน API ของ Next.js

// นำเข้าฟังก์ชัน connectMongoDB ซึ่งใช้ในการเชื่อมต่อกับฐานข้อมูล MongoDB
import { connectMongoDB } from "@/libs/MongoConnect";
// นำเข้าโมดูล Product ซึ่งเป็นโมเดลของสินค้าใน MongoDB
import Product from "@/libs/models/Product";
// นำเข้า Next.js functions NextRequest และ NextResponse เพื่อใช้ในการจัดการ request และ response ของเซิร์ฟเวอร์
import { NextRequest, NextResponse } from "next/server";

// ประกาศฟังก์ชัน POST และรับ request ผ่าน request ซึ่งเป็น NextRequest object
export async function POST(request: NextRequest) {
    try {

        // อ่านข้อมูลที่ส่งมาในรูปแบบ JSON จาก request
        const body = await request.json()
        // ทำการแยก object body เพื่อดึงค่าออกมา
        const { imgSrc, fileKey, name, category, price } = body


        //เรียกใช้ฟังก์ชัน connectMongoDB เพื่อเชื่อมต่อกับฐานข้อมูล MongoDB
        await connectMongoDB()

        //ใช้โมเดล Product เพื่อสร้างข้อมูลสินค้าใหม่ในฐานข้อมูล MongoDB จากข้อมูลที่รับเข้ามาผ่าน request
        const data = await Product.create({
            imgSrc,
            fileKey,
            name,
            category,
            price
        })

        // ส่ง response ในรูปแบบ JSON โดยระบุข้อความ "เพิ่มสินค้าสำเร็จ" และข้อมูลที่เพิ่งสร้างขึ้นไปยัง client
        return NextResponse.json({ msg: "เพิ่มสินค้าสำเร็จ", data })
    } catch (error) {
        // ถ้าเกิด error ขึ้นในการสร้างข้อมูลสินค้า จะส่ง response กลับไปยัง client
        return NextResponse.json(
            {
                error,
                msg: "Something Went Wrong"
            },
            { status: 400 }
        )
    }
}