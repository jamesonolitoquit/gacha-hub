export type Gear = {
  id: number;
  gameId: number;
  slug: string;
  name: string;
  source: string | null;
  twoPieceEffect: string | null;
  fourPieceEffect: string | null;
  description: string | null;
  iconUrl: string | null;
  tags: string[] | null;
  patchId: number | null;
};
