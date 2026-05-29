import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await prisma.product.findMany({
            include: {
                images: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(data);
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
