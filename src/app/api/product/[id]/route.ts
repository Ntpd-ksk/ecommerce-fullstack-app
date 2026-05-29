import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: true
            }
        });

        if (!product) {
            return NextResponse.json(
                { msg: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            {
                error,
                msg: "Something Went Wrong"
            },
            { status: 400 }
        );
    }
}
