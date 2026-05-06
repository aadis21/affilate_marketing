import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;

  // Protect /admin routes (not /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (role !== 'admin' && role !== 'superadmin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // Protect /superadmin routes
  if (pathname.startsWith('/superadmin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (role !== 'superadmin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/superadmin/:path*'],
};
