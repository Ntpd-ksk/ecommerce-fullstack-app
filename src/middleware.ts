import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";

    // ถ้าเข้าหน้า admin แต่ไม่ใช่ ADMIN ให้เตะไปหน้าแรก
    if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // ตรวจสอบว่ามี token (login แล้ว) หรือไม่
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/", // ถ้าไม่ได้ login ให้เตะไปหน้าแรก
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
