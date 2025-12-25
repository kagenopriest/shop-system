import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');

    if (!session && !request.nextUrl.pathname.startsWith('/login')) {
        // Redirect to login if accessing protected route
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (session && request.nextUrl.pathname.startsWith('/login')) {
        // Redirect to dashboard if already logged in
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/inventory/:path*', '/sales/:path*', '/users/:path*', '/login'],
};
