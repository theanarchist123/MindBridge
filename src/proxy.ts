import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect counsellors away from student dashboard
  if (token.role === "counsellor" && pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/counsellor/dashboard", req.url));
  }

  // Redirect students away from counsellor pages
  if (token.role === "student" && pathname.startsWith("/counsellor")) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

// Protect all dashboard + counsellor routes
// Public routes (landing, auth) are excluded automatically
export const config = {
  matcher: [
    "/home/:path*",
    "/assessment/:path*",
    "/mindbot/:path*",
    "/peer/:path*",
    "/mood/:path*",
    "/resources/:path*",
    "/onboarding/:path*",
    "/counsellor/:path*",
  ],
};
