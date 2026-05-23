import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const secret = searchParams.get('secret');
  if (secret !== process.env.ISR_REVALIDATION_SECRET) {
    return NextResponse.json({ revalidated: false, error: 'Invalid secret' }, { status: 401 });
  }

  const type = searchParams.get('type') ?? 'path';
  const value = searchParams.get('value');

  if (!value) {
    return NextResponse.json({ revalidated: false, error: 'Missing value parameter' }, { status: 400 });
  }

  try {
    if (type === 'tag') {
      revalidateTag(value);
    } else {
      revalidatePath(value);
    }
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}
