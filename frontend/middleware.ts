import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/asesmen') || 
        pathname.startsWith('/klien') || pathname.startsWith('/sesi') || 
        pathname.startsWith('/skrip')) {
      
      if (!token) {
        return NextResponse.redirect(new URL('/masuk', req.url));
      }

      // Check if user is verified (for therapist accounts)
      if (token && !token.isVerified) {
        // Redirect to verification notice or allow access with warning
        // For now, we'll allow access but the ProtectedRoute component will handle the UI
        return NextResponse.next();
      }
    }

    // Redirect authenticated users away from auth pages
    if (token && (pathname.startsWith('/masuk') || pathname.startsWith('/daftar'))) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 