// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!session) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/admin')) {
    const userId = session.user.id;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`);
      const user = await res.json();

      if (!user || user.role !== 'admin') {
        url.pathname = '/403';
        return NextResponse.rewrite(url);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      url.pathname = '/500';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
