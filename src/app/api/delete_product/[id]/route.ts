import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, URLParams: any) {
    try {
        const id = URLParams.params.id

        await prisma.product.delete({
            where: { id }
        })

        return NextResponse.json({ msg: "ลบสินค้าสำเร็จ" })
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
