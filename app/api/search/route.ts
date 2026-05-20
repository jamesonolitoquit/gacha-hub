import { NextResponse } from 'next/server';
import { searchService } from '../../../server/services/search.service';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') ?? '';
  const scope = (url.searchParams.get('scope') ?? 'all') as 'all' | 'game';
  const gameSlug = url.searchParams.get('gameSlug') ?? undefined;

  const results = searchService.search(query, scope, gameSlug);

  return NextResponse.json({
    data: results,
    meta: {
      query,
      scope,
      total: results.length,
    },
  });
}
