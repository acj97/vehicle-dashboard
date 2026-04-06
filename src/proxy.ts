import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ADMIN_ONLY = ["/dashboard"];

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;

    // Authenticated viewer hitting an admin-only route → redirect to /vehicles
    if (role !== "admin" && ADMIN_ONLY.some((r) => req.nextUrl.pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/vehicles", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized runs first — unauthenticated users never reach the middleware fn above
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/vehicles/:path*"],
};
