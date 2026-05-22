import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { characterService } from '../../../../../../server/services/character.service';
import { gameService } from '../../../../../../server/services/game.service';
import { guideService } from '../../../../../../server/services/guide.service';
import GuideMetaBar from '../../../../../../features/guides/components/GuideMetaBar';
import GuideContent from '../../../../../../features/guides/components/GuideContent';

type GuidePageProps = {
  params: {
    gameSlug: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  const games = moduleRegistry.list();
  const params: { gameSlug: string; slug: string }[] = [];

  for (const game of games) {
    const gameRecord = await gameService.getGameBySlug(game.slug);
    if (!gameRecord) continue;

    const guides = await guideService.listGuides(gameRecord.id);
    for (const guide of guides) {
      params.push({ gameSlug: game.slug, slug: guide.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: GuidePageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    return {};
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    return {};
  }

  const guide = await guideService.getGuide(gameRecord.id, params.slug);

  if (!guide) {
    return {};
  }

  return {
    title: `${guide.title} | ${game.name}`,
    description: guide.summary ?? `Guide for ${game.name}.`,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const game = moduleRegistry.get(params.gameSlug);

  if (!game) {
    notFound();
  }

  const gameRecord = await gameService.getGameBySlug(params.gameSlug);

  if (!gameRecord) {
    notFound();
  }

  const guide = await guideService.getGuide(gameRecord.id, params.slug);

  if (!guide) {
    notFound();
  }

  let character = null;

  if (guide.characterId) {
    character = await characterService.getCharacterById(gameRecord.id, guide.characterId);
  }

  const guideTypeMeta = game.taxonomies?.guideTypes
    ? game.taxonomies.guideTypes.find((gt) => gt.slug === guide.guideType)
    : undefined;

  return (
    <section aria-labelledby="guide-title" className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{game.name}</p>
      <h1 id="guide-title" className="mt-3 text-4xl font-semibold">{guide.title}</h1>
      {guide.summary ? (
        <p className="mt-3 max-w-2xl text-white/80">{guide.summary}</p>
      ) : null}

      <div className="mt-4">
        <GuideMetaBar guide={guide} guideTypeMeta={guideTypeMeta} />
      </div>

      <div className="mt-8 grid gap-6">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <GuideContent content={guide.content} />
        </article>

        {character ? (
          <Link
            href={`/games/${game.slug}/characters/${character.slug}`}
            className="inline-flex min-h-11 w-fit items-center rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-sky-300/40 hover:bg-white/10 focus-visible:border-sky-300/55 focus-visible:bg-white/15"
          >
            View character: {character.name}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
