import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { rateLimit } from './app/lib/rate-limit';

const BAD_BOTS = [
  'ahrefsbot', 'semrushbot', 'mj12bot', 'dotbot',
  'petalbot', 'bytespider', 'gptbot', 'ccbot',
];

const isBadBot = (req) => {
  const ua = req.headers.get('user-agent')?.toLowerCase() || '';
  return BAD_BOTS.some((bot) => ua.includes(bot));
};

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isApiRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isBadBot(req)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  if (isApiRoute(req)) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const { success } = rateLimit(ip, 60, 60000);
    if (!success) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  if (isAdminRoute(req) || isDashboardRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
