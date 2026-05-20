import { NextResponse } from 'next/server';
import { gameService } from '../../../server/services/game.service';

export async function GET() {
  const games = await gameService.listGames();
  return NextResponse.json({ data: games });
}
