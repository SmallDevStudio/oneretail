import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req });
    const { pathname, search } = req.nextUrl;

    // ✅ อนุญาตให้เข้าถึง `/login`, `/register`, และ `/public/dist/*` ได้โดยไม่ต้อง Auth
    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/dist/")
    ) {
        return NextResponse.next();
    }

    // ❌ ถ้าไม่มี Token ให้ Redirect ไป `/login` พร้อมกับ callbackUrl
    if (!token) {
        const callbackUrl = encodeURIComponent(req.nextUrl.href);  // เก็บ URL ปัจจุบัน
        return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }

    // ✅ ถ้ามี Token และอยู่ที่ `/login` ให้ redirect กลับไปหน้า `callbackUrl` ถ้ามี หรือ `/main`
    if (token && pathname === "/login") {
        const redirectTo = req.nextUrl.searchParams.get("callbackUrl") || "/";
        return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|dist/).*)",
};
