import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { imgSrc, name, price } = body

        const data = await prisma.product.create({
            data: {
                imagePath: imgSrc,
                name,
                description: "", // กำหนดค่าว่างไว้ก่อนตาม Schema
                price: Number(price),
                stock: 10, // กำหนดค่าเริ่มต้น
            }
        })

        return NextResponse.json({ msg: "เพิ่มสินค้าสำเร็จ", data })
    } catch (error) {
        return NextResponse.json(
            {
                error,
                msg: "Something Went Wrong"
            },
            { status: 400 }
        )
    }
}
