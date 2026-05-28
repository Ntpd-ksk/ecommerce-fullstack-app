import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import { authOptions } from "@/libs/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = params;

    // Delete order items first due to foreign key constraints
    await prisma.orderItem.deleteMany({
      where: { orderId }
    });

    // Then delete the order
    await prisma.order.delete({
      where: { id: orderId }
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
