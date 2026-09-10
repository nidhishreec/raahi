import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/kds")) {
    const token = req.cookies.get("raahi_staff_session")?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/staff-login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // /admin protects itself -- the page component checks for a valid
  // owner session and renders its own login form if missing.

  return NextResponse.next();
}

export const config = {
  matcher: ["/kds/:path*", "/admin/:path*"],
};
