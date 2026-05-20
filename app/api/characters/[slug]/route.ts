import { NextResponse } from 'next/server';
import { characterService } from '../../../../server/services/character.service';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const url = new URL(request.url);
  const gameId = Number(url.searchParams.get('gameId') ?? '0');

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  const character = await characterService.getCharacter(gameId, params.slug);

  if (!character) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  return NextResponse.json({ data: character });
}
