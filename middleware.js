import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // If not logged in, redirect to sign-in page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"], // Apply middleware to specific routes
};
