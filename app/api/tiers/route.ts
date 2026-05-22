import { NextResponse } from 'next/server';
import { tierListRepository } from '../../../server/repositories/tier-list.repository';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gameId = Number(url.searchParams.get('gameId') ?? '0');

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  const lists = await tierListRepository.findByGameId(gameId);
  return NextResponse.json({ data: lists });
}
