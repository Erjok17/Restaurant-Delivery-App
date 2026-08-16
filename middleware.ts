import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const customerProtectedRoutes = ["/account/profile", "/account/orders", "/account/reservations"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isExactAccountPage = path === "/account";
  const isCustomerProtected =
    isExactAccountPage ||
    customerProtectedRoutes.some((route) => path.startsWith(route));
  const isDriverRoute = path.startsWith("/driver");
  const isAdminRoute = path.startsWith("/admin");

  if (!isCustomerProtected && !isDriverRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  if (isDriverRoute && session.role !== "DRIVER") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAdminRoute && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account",
    "/account/profile/:path*",
    "/account/orders/:path*",
    "/account/reservations/:path*",
    "/driver/:path*",
    "/admin/:path*",
  ],
};