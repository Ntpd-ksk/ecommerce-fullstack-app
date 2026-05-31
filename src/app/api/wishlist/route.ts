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

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: (session.user as any).id },
      include: {
        product: { include: { images: true } },
      },
    });

    // Return only product data
    const products = wishlist.map((item) => item.product);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET wishlist error:", error);
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Check if product exists in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      // Remove if exists
      await prisma.wishlist.delete({
        where: {
          id: existing.id,
        },
      });
      return NextResponse.json({ message: "Removed from wishlist", status: "removed" });
    } else {
      // Add if not exists
      await prisma.wishlist.create({
        data: {
          userId,
          productId,
        },
      });
      return NextResponse.json({ message: "Added to wishlist", status: "added" });
    }
  } catch (error) {
    console.error("POST wishlist error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
