import { NextResponse } from 'next/server';
import { characterService } from '../../../../server/services/character.service';
import { findSeedCharacter } from '../../../../server/bootstrap-data';

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

  // If artwork fields are missing from DB, try to source from pruned/sample seeds.
  if (character && (!character.portraitUrl || !character.fullArtUrl || !character.iconUrl)) {
    try {
      const seed = findSeedCharacter(gameId, params.slug);
      if (seed) {

        character.portraitUrl = character.portraitUrl ?? (seed as any).portraitUrl ?? (seed as any).portrait_url ?? null;
        character.fullArtUrl = character.fullArtUrl ?? (seed as any).fullArtUrl ?? (seed as any).full_art_url ?? null;
        character.iconUrl = character.iconUrl ?? (seed as any).iconUrl ?? (seed as any).icon_url ?? null;
      }
    } catch (e) {
      // ignore
    }
  }

  return NextResponse.json({ data: character });
}
