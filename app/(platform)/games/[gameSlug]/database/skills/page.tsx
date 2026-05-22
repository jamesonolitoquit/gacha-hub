import { redirect } from 'next/navigation';

type Props = {
  params: { gameSlug: string };
};

export default function DatabaseSkillsPage({ params }: Props) {
  redirect(`/games/${params.gameSlug}/skills`);
}
