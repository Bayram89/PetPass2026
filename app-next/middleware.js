import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/auth") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  const lowerPath = url.pathname.toLowerCase();

  if (path !== lowerPath) {
    url.pathname = lowerPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
