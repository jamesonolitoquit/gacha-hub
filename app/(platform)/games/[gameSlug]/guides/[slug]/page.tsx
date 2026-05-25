import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { moduleRegistry } from '../../../../../../core/module-registry';
import { characterService } from '../../../../../../server/services/character.service';
import { gameService } from '../../../../../../server/services/game.service';
import { guideService } from '../../../../../../server/services/guide.service';
import GuideMetaBar from '../../../../../../features/guides/components/GuideMetaBar';
import GuideContent from '../../../../../../features/guides/components/GuideContent';
import InlineCharacterCard from '../../../../../../features/guides/components/InlineCharacterCard';

export const revalidate = 3600;

const getGuidePageData = cache(async (gameSlug: string, slug: string) => {
  const gameRecord = await gameService.getGameBySlug(gameSlug);
  if (!gameRecord) return null;
  const guide = await guideService.getGuide(gameRecord.id, slug);
  if (!guide) return null;
  let character = null;
  if (guide.characterId) {
    character = await characterService.getCharacterById(gameRecord.id, guide.characterId);
  }
  return { gameRecord, guide, character };
});

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
  if (!game) return {};

  const data = await getGuidePageData(params.gameSlug, params.slug);
  if (!data) return {};

  return {
    title: `${data.guide.title} | ${game.name}`,
    description: data.guide.summary ?? `Guide for ${game.name}.`,
    alternates: { canonical: `/games/${params.gameSlug}/guides/${params.slug}` },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const game = moduleRegistry.get(params.gameSlug);
  if (!game) notFound();

  const data = await getGuidePageData(params.gameSlug, params.slug);
  if (!data) notFound();

  const { gameRecord, guide, character } = data;

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
          <InlineCharacterCard gameSlug={params.gameSlug} character={character} />
        ) : null}
      </div>
    </section>
  );
}
