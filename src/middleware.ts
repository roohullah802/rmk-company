import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)', '/sign-in(.*)', '/sign-up(.*)']);
const isPublicDashboardRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';
  const isDashboard =
    hostname.startsWith('dashboard.') ||
    hostname.startsWith('dashboard.localhost');

  // Rewrite dashboard subdomain to /dashboard path
  if (isDashboard && !url.pathname.startsWith('/dashboard') && !url.pathname.startsWith('/sign-')) {
    url.pathname = `/dashboard${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Protect dashboard routes
  if (isDashboardRoute(req) && !isPublicDashboardRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
