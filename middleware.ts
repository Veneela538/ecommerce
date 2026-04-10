import { DEFAULT_LOGIN_REDIRECT, publicRoutes } from "@/routes";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublicRoute =
    publicRoutes.filter((item) => nextUrl.pathname.startsWith(`${item}`))
      .length > 0;

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (nextUrl.pathname == "/") {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin));
  }

  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const loginUrl = new URL(`/auth/login`, nextUrl);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return Response.redirect(loginUrl);
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
