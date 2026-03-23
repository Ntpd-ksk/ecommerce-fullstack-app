// โค้ดนี้เป็นฟังก์ชัน DELETE ที่ใช้ในการลบข้อมูลสินค้าออกจากฐานข้อมูล MongoDB ผ่าน API ของ Next.js 

// นำเข้าฟังก์ชัน connectMongoDB เพื่อใช้ในการเชื่อมต่อกับฐานข้อมูล MongoDB
import { connectMongoDB } from "@/libs/MongoConnect";
// นำเข้าโมดูล Product เพื่อใช้ในการจัดการข้อมูลสินค้าใน MongoDB
import Product from "@/libs/models/Product";
// นำเข้า functions NextRequest และ NextResponse เพื่อใช้ในการจัดการ request และ response ของเซิร์ฟเวอร์
import { NextRequest, NextResponse } from "next/server";

// ประกาศฟังก์ชัน DELETE โดย URLParams เป็นข้อมูลที่ส่งมาพร้อม URL ซึ่งใช้ในการระบุ id ของสินค้าที่ต้องการลบ
export async function DELETE(request: NextRequest, URLParams: any) {
    try{
        // ดึงค่า id ของสินค้าที่ต้องการลบจาก URLParams
        const id = URLParams.params.id

        // เรียกใช้ฟังก์ชัน connectMongoDB เพื่อเชื่อมต่อกับฐานข้อมูล MongoDB
        await connectMongoDB()

        // ใช้โมเดล Product เพื่อลบข้อมูลสินค้าจากฐานข้อมูล MongoDB โดยใช้ id ที่ระบุ
        await Product.findByIdAndDelete(id)

        // ส่ง response ในรูปแบบ JSON โดยระบุข้อความ "ลบสินค้าสำเร็จ" กลับไปยัง client เมื่อการลบสินค้าสำเร็จ
        return NextResponse.json({msg: "ลบสินค้าสำเร็จ" })
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