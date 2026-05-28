import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, URLParams: any) {
    try {
        const body = await request.json()
        const id = URLParams.params.id
        const { name, price } = body

        const data = await prisma.product.update({
            where: { id },
            data: {
                name,
                price: Number(price)
            }
        })

        return NextResponse.json({ msg: "แก้ไขสินค้าสำเร็จ", data })
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
