import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import { authOptions } from "@/libs/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: (session.user as any).id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, total, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items in order" }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        total: Number(total),
        paymentMethod: paymentMethod || "bank",
        status: paymentMethod === "cod" ? "PROCESSING" : "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      } as any, // Use as any to bypass potential type mismatch if generate failed
      include: {
        items: true
      }
    });

    return NextResponse.json({ order: newOrder });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({
      message: "Internal Server Error",
      details: error.message
    }, { status: 500 });
  }
}
