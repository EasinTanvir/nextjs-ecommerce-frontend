import { getToken } from "next-auth/jwt";

import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  const currentPath = req.nextUrl.pathname;

  // protected routes
  if (currentPath.includes("checkout") || currentPath.includes("dashboard")) {
    // not logged in
    if (!isLoggedIn) {
      const loginUrl = new URL("/signin", req.nextUrl);

      loginUrl.searchParams.set("callbackUrl", currentPath);

      return NextResponse.redirect(loginUrl);
    }

    // role check
    if (
      currentPath.includes("dashboard") &&
      token?.role !== "ADMIN" &&
      token?.role !== "MANAGER"
    ) {
      return NextResponse.redirect(new URL("/me", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
