import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const redirects: Record<string, string> = {
  "/about-us": "/about",
  "/about-us/": "/about",
  "/contact-us": "/contact",
  "/contact-us/": "/contact",
  "/product-category/retail": "/shop",
  "/product-category/retail/": "/shop",
  "/product-category/wholesale": "/wholesale",
  "/product-category/wholesale/": "/wholesale",
  "/product/yeskoko-sweetened-coconut-flakes-2":
    "/product/yeskoko-sweetened-coconut-flakes",
  "/product/yeskoko-sweetened-coconut-flakes-2/":
    "/product/yeskoko-sweetened-coconut-flakes",
  "/product/unsweetened-coconut-flakes-2":
    "/product/unsweetened-coconut-flakes",
  "/product/unsweetened-coconut-flakes-2/":
    "/product/unsweetened-coconut-flakes",
  "/my-account": "/contact",
  "/my-account/": "/contact",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const target = redirects[pathname];
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/about-us",
    "/about-us/",
    "/contact-us",
    "/contact-us/",
    "/product-category/:path*",
    "/product/yeskoko-sweetened-coconut-flakes-2",
    "/product/yeskoko-sweetened-coconut-flakes-2/",
    "/product/unsweetened-coconut-flakes-2",
    "/product/unsweetened-coconut-flakes-2/",
    "/my-account",
    "/my-account/",
  ],
};
