import { NextResponse } from 'next/server';
import { skillService } from '../../../server/services/skill.service';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const characterId = Number(url.searchParams.get('characterId') ?? '0');

  if (!characterId) {
    return NextResponse.json({ error: 'characterId is required' }, { status: 400 });
  }

  const skills = await skillService.listSkillsForCharacter(characterId);
  return NextResponse.json({ data: skills });
}
