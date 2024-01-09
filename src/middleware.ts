import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if request is valid JSON
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { data: null, message: "Invalid content type", error: true },
      { status: 400 }
    );
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/:path*",
};
