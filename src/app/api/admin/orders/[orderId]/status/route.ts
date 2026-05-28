import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import { authOptions } from "@/libs/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = params;
    const { status, trackingNumber } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        trackingNumber: trackingNumber || undefined
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
