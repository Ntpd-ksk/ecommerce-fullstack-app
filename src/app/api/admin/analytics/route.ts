import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import { authOptions } from "@/libs/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30days"; // today, 7days, 30days, month, all, custom
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    let startDate: Date | undefined;
    let endDate: Date = new Date();

    const now = new Date();

    if (range === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === "7days") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "30days") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === "custom" && startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(endDateParam);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // all time
      startDate = undefined;
    }

    const dateFilter = startDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate,
      }
    } : {};

    // 1. Core Summary Metrics
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count({
      where: dateFilter
    });

    const paidOrders = await prisma.order.findMany({
      where: {
        ...dateFilter,
        status: {
          in: ["PAID", "SHIPPING", "SUCCESS"]
        }
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
        status: true,
        items: {
          select: {
            productId: true,
            quantity: true,
            price: true,
            product: {
              select: {
                name: true,
                category: true,
                images: {
                  take: 1,
                  select: { url: true }
                }
              }
            }
          }
        }
      }
    });

    const totalRevenue = paidOrders.reduce((acc, order) => acc + Number(order.total), 0);
    const avgOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

    const pendingSlips = await prisma.order.count({
      where: {
        status: "VERIFYING"
      }
    });

    // 2. Order counts by status
    const orderStats = await prisma.order.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: {
        status: true
      }
    });

    // 3. Daily / Timeline Revenue Chart
    // Build aggregated daily metrics
    const dailyMap: Record<string, { date: string; revenue: number; orders: number }> = {};

    // If range is within 30 days or 7 days, generate all intermediate days so chart is continuous
    if (startDate) {
      const cur = new Date(startDate);
      const endLimit = new Date(endDate);
      while (cur <= endLimit) {
        const key = cur.toISOString().split("T")[0];
        const formattedDate = cur.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
        dailyMap[key] = { date: formattedDate, revenue: 0, orders: 0 };
        cur.setDate(cur.getDate() + 1);
      }
    }

    paidOrders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().split("T")[0];
      if (!dailyMap[key]) {
        const formattedDate = new Date(order.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
        dailyMap[key] = { date: formattedDate, revenue: 0, orders: 0 };
      }
      dailyMap[key].revenue += Number(order.total);
      dailyMap[key].orders += 1;
    });

    const revenueTimeline = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, val]) => val);

    // 4. Sales by Category
    const categoryMap: Record<string, { category: string; revenue: number; count: number }> = {};
    const productSalesMap: Record<string, {
      id: string;
      name: string;
      category: string;
      image: string;
      soldQty: number;
      totalSales: number;
    }> = {};

    paidOrders.forEach(order => {
      order.items.forEach(item => {
        const cat = item.product?.category || "อื่นๆ";
        if (!categoryMap[cat]) {
          categoryMap[cat] = { category: cat, revenue: 0, count: 0 };
        }
        const itemTotal = Number(item.price) * item.quantity;
        categoryMap[cat].revenue += itemTotal;
        categoryMap[cat].count += item.quantity;

        // Top products
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            id: item.productId,
            name: item.product?.name || "สินค้าไม่ทราบชื่อ",
            category: cat,
            image: item.product?.images?.[0]?.url || "/placeholder.jpg",
            soldQty: 0,
            totalSales: 0,
          };
        }
        productSalesMap[item.productId].soldQty += item.quantity;
        productSalesMap[item.productId].totalSales += itemTotal;
      });
    });

    const categoryStats = Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue);
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.soldQty - a.soldQty)
      .slice(0, 6);

    // 5. Low Stock Alert Products (stock <= 5)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 5
        }
      },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        category: true,
        images: {
          take: 1,
          select: { url: true }
        }
      },
      orderBy: {
        stock: 'asc'
      },
      take: 6
    });

    // 6. Recent Orders (5 latest)
    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        total: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          take: 1,
          select: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      avgOrderValue,
      pendingSlips,
      orderStats,
      revenueTimeline,
      categoryStats,
      topProducts,
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    console.error("Fetch analytics error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
