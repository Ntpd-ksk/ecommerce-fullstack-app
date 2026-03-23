// โค้ดนี้เป็นฟังก์ชัน PUT ที่ใช้ในการแก้ไขข้อมูลสินค้าในฐานข้อมูล MongoDB ผ่าน API ของ Next.js

// นำเข้าฟังก์ชัน connectMongoDB เพื่อใช้ในการเชื่อมต่อกับฐานข้อมูล MongoDB
import { connectMongoDB } from "@/libs/MongoConnect";
// นำเข้าโมดูล Product เพื่อใช้ในการจัดการข้อมูลสินค้าใน MongoDB
import Product from "@/libs/models/Product";
// นำเข้า Next.js functions NextRequest และ NextResponse เพื่อใช้ในการจัดการเซิร์ฟเวอร์
import { NextRequest, NextResponse } from "next/server";

// ประกาศฟังก์ชัน PUT โดย URLParams เป็นข้อมูลที่ส่งมาพร้อม URL ซึ่งใช้ในการระบุ id ของสินค้าที่ต้องการแก้ไข
export async function PUT(request: NextRequest, URLParams: any) {
    try{

        // อ่านข้อมูลที่ส่งมาในรูปแบบ JSON จาก request
        const body = await request.json()
        // ดึงค่า id ของสินค้าที่ต้องการแก้ไขจาก URLParams
        const id = URLParams.params.id
        // แยก object body เพื่อดึงค่าออกมา
        const { name, category, price } = body

        // เรียกใช้ฟังก์ชัน connectMongoDB เพื่อเชื่อมต่อกับฐานข้อมูล MongoDB
        await connectMongoDB()

        // แสดงค่าใน console เพื่อตรวจสอบความถูกต้องของข้อมูลที่รับเข้ามา
        console.log(id, name, category, price)

        // ใช้โมเดล Product เพื่อแก้ไขข้อมูลสินค้าในฐานข้อมูล MongoDB โดยใช้ id และข้อมูลที่รับเข้ามาใหม่
        const data = await Product.findByIdAndUpdate(id, {
            name,
            category,
            price
        })

        // ส่ง response ในรูปแบบ JSON โดยระบุข้อความ "แก้ไขสินค้าสำเร็จ" และข้อมูลที่ถูกแก้ไขไปยัง client
        return NextResponse.json({msg: "แก้ไขสินค้าสำเร็จ", data})
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