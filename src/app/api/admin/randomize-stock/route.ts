import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.product.findMany();

        if (products.length === 0) {
            return NextResponse.json({ msg: "No products found" });
        }

        // สุ่มเลือก 5 รายการให้เป็นสินค้าหมด (stock = 0)
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const outOfStockIds = new Set(shuffled.slice(0, 5).map(p => p.id));

        const updatedProducts = [];

        for (const p of products) {
            let targetStock = 0;
            if (outOfStockIds.has(p.id)) {
                targetStock = 0;
            } else {
                // สุ่มสต็อกระหว่าง 10 ถึง 50 ชิ้น
                targetStock = Math.floor(Math.random() * 41) + 10;
            }

            const updated = await prisma.product.update({
                where: { id: p.id },
                data: { stock: targetStock },
                select: { id: true, name: true, stock: true }
            });
            updatedProducts.push(updated);
        }

        return NextResponse.json({
            msg: "อัปเดตสต็อกเรียบร้อยแล้ว (สุ่มหมด 5 รายการ)",
            total: products.length,
            outOfStockCount: 5,
            data: updatedProducts
        });
    } catch (error: any) {
        console.error("Randomize stock error:", error);
        return NextResponse.json(
            { error: error.message, msg: "Failed to randomize stock" },
            { status: 500 }
        );
    }
}
