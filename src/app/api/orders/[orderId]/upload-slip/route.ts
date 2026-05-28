import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import { authOptions } from "@/libs/auth";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { paymentSlip } = body;

    if (!paymentSlip) {
      return NextResponse.json({ message: "No slip provided" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.orderId,
        userId: (session.user as any).id,
      } as any,
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Use raw query to bypass potential Prisma Client type mismatch
    await prisma.$executeRaw`UPDATE \`Order\` SET paymentSlip = ${paymentSlip}, status = 'VERIFYING', updatedAt = NOW() WHERE id = ${params.orderId}`;

    const updated = await prisma.order.findFirst({
      where: { id: params.orderId } as any,
    });

    return NextResponse.json({ order: updated });
  } catch (error: any) {
    console.error("Upload slip error:", error);
    return NextResponse.json({
      message: "Internal Server Error",
      details: error.message,
    }, { status: 500 });
  }
}
