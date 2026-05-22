import { NextResponse } from 'next/server';
import { gameService } from '../../../../server/services/game.service';

export async function GET(
  _request: Request,
  { params }: { params: { gameSlug: string } }
) {
  const game = await gameService.getGameBySlug(params.gameSlug);

  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  return NextResponse.json({ data: game });
}
