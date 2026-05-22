export type Pet = {
  id: number;
  gameId: number;
  slug: string;
  name: string;
  rarity: string | null;
  faction: string | null;
  passive1Name: string | null;
  passive1Description: string | null;
  passive1Enhanced: string | null;
  passive2Name: string | null;
  passive2Description: string | null;
  passive2Enhanced: string | null;
  iconUrl: string | null;
  patchId: number | null;
};
