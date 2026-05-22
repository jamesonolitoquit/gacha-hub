import { NextResponse } from 'next/server';
import { characterService } from '../../../../server/services/character.service';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gameId = Number(url.searchParams.get('gameId') ?? '0');
  const page = Number(url.searchParams.get('page') ?? '1');
  const limit = Number(url.searchParams.get('limit') ?? '20');
  const search = url.searchParams.get('q') ?? url.searchParams.get('search') ?? '';
  const rarity = url.searchParams.get('rarity') ?? undefined;
  const role = url.searchParams.get('role') ?? undefined;

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  const result = await characterService.listCharactersPaged(gameId, { page, limit, search, rarity, role });

  return NextResponse.json({ data: result.rows, meta: { total: result.total, page, limit } });
}
