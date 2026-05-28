import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import { authOptions } from "@/libs/auth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, birthDate, facebook, line, image } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        birthDate,
        facebook,
        line,
        image,
      },
    });

    return NextResponse.json({ message: "Update success", user: updatedUser });
  } catch (error: any) {
    console.error("UPDATE_USER_ERROR:", error);
    return NextResponse.json({ message: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
