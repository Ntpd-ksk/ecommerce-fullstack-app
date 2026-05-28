import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import { authOptions } from "@/libs/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { name, phone, address, province, district, subDistrict, postalCode, isDefault } = body;

    // Check ownership
    const existing = await prisma.address.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: (session.user as any).id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        name,
        phone,
        address,
        province,
        district,
        subDistrict,
        postalCode,
        isDefault: !!isDefault,
      },
    });

    return NextResponse.json({ address: updated });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const existing = await prisma.address.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Address deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
