import { redirect } from 'next/navigation';

type Props = {
  params: { gameSlug: string };
};

export default function DatabaseHeroesPage({ params }: Props) {
  redirect(`/games/${params.gameSlug}/characters`);
}
