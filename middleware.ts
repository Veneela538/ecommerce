import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "@/routes";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute && nextUrl.pathname != "/auth/signup") {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    return Response.redirect(new URL(`/auth/login`, nextUrl));
  }

  if (isLoggedIn) {
    const response = NextResponse.next();
    response.headers.set("x-current-path", nextUrl.pathname);
    return response;
  }
  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    // "/",
    // "/(api|trpc)(.*)",
    // "/((?!.+\\.[\\w]+$|_next).*)",
  ],
};
