import { NextResponse } from 'next/server';
import { characterService } from '../../../server/services/character.service';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gameId = Number(url.searchParams.get('gameId') ?? '0');

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  const characters = await characterService.listCharacters(gameId);
  return NextResponse.json({ data: characters });
}
