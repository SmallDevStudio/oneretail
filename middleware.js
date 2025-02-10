import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req });

    // URL ที่กำลังถูกเรียก
    const { pathname } = req.nextUrl;

    // ✅ อนุญาตให้เข้าถึง `/login` ได้โดยไม่ต้อง Auth
    if (pathname === "/login") {
        return NextResponse.next();
    }

    // ❌ ถ้าไม่มี Token ให้ Redirect ไป `/login`
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// ✅ ใช้ Middleware กับทุกเส้นทาง ยกเว้น API, Static Files และ Next.js Assets
export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
