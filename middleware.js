import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // ✅ อนุญาตให้เข้าถึง `/login`, `/register` ได้โดยไม่ต้อง Auth
    if (
        pathname.startsWith("/login") || 
        pathname.startsWith("/register") ||
        pathname.startsWith("/dist")) {
        return NextResponse.next();
    }

    // ❌ ถ้าไม่มี Token ให้ Redirect ไป `/login` ยกเว้นถ้า URL เป็น `/login`
    if (!token && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ ถ้ามี Token และพยายามเข้า `/login` ให้พาไป `/main`
    if (token && pathname === "/login") {
        return NextResponse.redirect(new URL("/main", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
