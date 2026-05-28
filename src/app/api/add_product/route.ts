import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { imgSrc, name, category, price, brand, discountPrice, description, stock, warranty, specs, tags } = body

        const data = await prisma.product.create({
            data: {
                imagePath: imgSrc,
                name,
                category,
                brand: brand || "",
                sku: `SKU-${Date.now()}`,
                description: description || "",
                price: Number(price),
                discountPrice: discountPrice ? Number(discountPrice) : null,
                stock: Number(stock) || 10,
                warranty: warranty || "",
                specs: specs || {},
                tags: tags || []
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
