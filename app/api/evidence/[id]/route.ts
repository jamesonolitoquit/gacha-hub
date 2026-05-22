import { NextRequest, NextResponse } from 'next/server';
import { evidenceService } from '../../../../server/services/evidence.service';

type RouteParams = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid evidence id' }, { status: 400 });
  }

  const evidence = await evidenceService.getEvidence(id);

  if (!evidence) {
    return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
  }

  return NextResponse.json(evidence);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid evidence id' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const evidence = await evidenceService.updateEvidence(id, body);

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    return NextResponse.json(evidence);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
