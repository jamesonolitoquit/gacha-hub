import { NextResponse } from 'next/server';
import { skillService } from '../../../../server/services/skill.service';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const url = new URL(request.url);
  const gameId = Number(url.searchParams.get('gameId') ?? '0');

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  const skill = await skillService.getSkill(gameId, params.slug);

  if (!skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
  }

  return NextResponse.json({ data: skill });
}
