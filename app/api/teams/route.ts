import { NextRequest, NextResponse } from 'next/server';
import { teamService } from '../../../server/services/team.service';
import { gameService } from '../../../server/services/game.service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = searchParams.get('gameId');

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  const game = await gameService.getGameBySlug(gameId);
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  const teams = await teamService.listTeams(game.id);
  return NextResponse.json(teams);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, name, characterIds } = body;

    if (!gameId || !name || !characterIds) {
      return NextResponse.json({ error: 'gameId, name, and characterIds are required' }, { status: 400 });
    }

    const game = await gameService.getGameBySlug(gameId);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const team = await teamService.createTeam({
      gameId: game.id,
      slug: body.slug ?? null,
      name,
      characterIds: Array.isArray(characterIds) ? characterIds.join(',') : characterIds,
      synergyScore: body.synergyScore ?? null,
      powerLevel: body.powerLevel ?? null,
      purpose: body.purpose ?? null,
      difficulty: body.difficulty ?? null,
      evidenceId: body.evidenceId ?? null,
      createdBy: body.createdBy ?? null,
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
