import { NextRequest, NextResponse } from 'next/server';
import { resolveRoute } from './core/route-resolver';

export function middleware(request: NextRequest) {
  const resolved = resolveRoute(request.nextUrl.pathname, request.headers.get('host') ?? undefined);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('x-gachahub-pathname', request.nextUrl.pathname);
  requestHeaders.set('x-gachahub-route-segment', resolved.routeSegment);

  if (resolved.gameSlug) {
    requestHeaders.set('x-gachahub-game-slug', resolved.gameSlug);
  }

  if (resolved.gameModule) {
    requestHeaders.set('x-gachahub-game-name', resolved.gameModule.name);
  }

  for (const [key, value] of Object.entries(resolved.params)) {
    requestHeaders.set(`x-gachahub-param-${key}`, value);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};