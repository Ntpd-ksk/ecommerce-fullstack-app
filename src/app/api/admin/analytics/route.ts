import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import { authOptions } from "@/libs/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();

    const paidOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["PAID", "SHIPPING", "SUCCESS"]
        }
      },
      select: {
        total: true
      }
    });

    const totalRevenue = paidOrders.reduce((acc, order) => acc + Number(order.total), 0);

    const pendingSlips = await prisma.order.count({
      where: {
        status: "VERIFYING"
      }
    });

    // Get order stats by status
    const orderStats = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      pendingSlips,
      orderStats
    });
  } catch (error) {
    console.error("Fetch analytics error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
