import { NextRequest, NextResponse } from 'next/server';
import { evidenceService } from '../../../server/services/evidence.service';
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

  const evidence = await evidenceService.listEvidence(game.id);
  return NextResponse.json(evidence);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, sourceUrl, sourceHash, extractedData, aiModel } = body;

    if (!gameId || !sourceUrl) {
      return NextResponse.json({ error: 'gameId and sourceUrl are required' }, { status: 400 });
    }

    const game = await gameService.getGameBySlug(gameId);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const evidence = await evidenceService.createEvidence({
      evidenceType: body.evidenceType ?? 'screenshot',
      sourceUrl,
      sourceHash: sourceHash ?? null,
      extractedData: extractedData ? JSON.stringify(extractedData) : null,
      confidenceScore: body.confidenceScore ?? null,
      aiModel: aiModel ?? null,
      gameId: game.id,
      patchId: body.patchId ?? null,
      claimType: body.claimType ?? null,
      isVerified: body.isVerified ?? false,
      verifiedBy: body.verifiedBy ?? null,
      verificationNotes: body.verificationNotes ?? null,
    });

    return NextResponse.json(evidence, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
