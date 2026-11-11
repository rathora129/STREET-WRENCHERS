import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'sw_session';

export function middleware(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  // The login page validates the session server-side before redirecting, so an
  // expired or forged cookie cannot bounce between /login and /dashboard.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-sw-path', pathname);
  requestHeaders.set('x-sw-search', search || '');

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico).*)'],
};
