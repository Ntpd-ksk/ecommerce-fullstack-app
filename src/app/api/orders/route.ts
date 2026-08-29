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
            product: { include: { images: true } }
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
    const { items, address, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items in order" }, { status: 400 });
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      let calculatedTotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const productId = item.id || item.productId;

        const product = await tx.product.findUnique({
          where: { id: productId }
        });

        if (!product) {
          throw new Error(`ไม่พบสินค้า ID: ${productId}`);
        }

        const quantity = Number(item.quantity);

        if (product.stock < quantity) {
          throw new Error(`สินค้า ${product.name} มีจำนวนสต็อกไม่เพียงพอ (คงเหลือ ${product.stock})`);
        }

        // หักสต็อก
        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } }
        });

        // คำนวณราคา
        const price = product.discountPrice ? Number(product.discountPrice) : Number(product.price);
        calculatedTotal += price * quantity;

        orderItemsData.push({
          productId: productId,
          quantity: quantity,
          price: price,
        });
      }

      // สร้างออเดอร์
      const order = await tx.order.create({
        data: {
          userId: (session.user as any).id,
          total: calculatedTotal,
          address: address || "",
          paymentMethod: paymentMethod || "bank",
          paymentSlip: null,
          status: paymentMethod === "cod" ? "PROCESSING" : "PENDING",
          items: {
            create: orderItemsData
          }
        } as any,
        include: {
          items: true
        }
      });

      return order;
    });

    return NextResponse.json({ order: newOrder });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({
      message: error.message || "Internal Server Error",
    }, { status: 500 });
  }
}
