import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(request: NextRequest, URLParams: any) {
    try {
        const id = URLParams.params.id

        // 1. ค้นหาข้อมูลรูปภาพก่อนลบ
        const product = await prisma.product.findUnique({
            where: { id },
            include: { images: true }
        })

        if (!product) {
            return NextResponse.json({ msg: "ไม่พบสินค้า" }, { status: 404 })
        }

        // 2. ลบไฟล์จริงใน public/uploads
        for (const img of product.images) {
            try {
                const filePath = path.join(process.cwd(), "public", img.url);
                await unlink(filePath);
            } catch (err) {
                console.error(`Failed to delete file: ${img.url}`, err);
            }
        }

        // 3. ลบข้อมูลใน Database (Cascading delete handles ProductImage)
        await prisma.product.delete({
            where: { id }
        })

        return NextResponse.json({ msg: "ลบสินค้าสำเร็จ" })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                error,
                msg: "Something Went Wrong"
            },
            { status: 400 }
        )
    }
}
