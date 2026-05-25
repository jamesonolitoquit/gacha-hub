export type NormalizedCharacter = {
  id: number;
  gameId: number;
  slug: string;
  name: string;
  rarity: string | null;
  element: string | null;
  characterClass: string | null;
  role: string | null;
  portraitUrl: string | null;
  fullArtUrl: string | null;
  iconUrl: string | null;
  description: string;
  tags: string[] | null;
  releasePatchId: number | null;
  introducedInPatchId: number | null;
  lastVerifiedPatchId: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type NormalizedSkill = {
  id: number;
  characterId: number;
  slug: string;
  name: string;
  type: string | null;
  description: string | null;
  cooldownTurns: number | null;
  cost: number | null;
  powerType: string | null;
  scalingStat: string | null;
  targets: string | null;
  rangeType: string | null;
  order: number | null;
  enhancementText: string | null;
  transcendenceText: string | null;
  iconUrl: string | null;
  animationUrl: string | null;
  introducedInPatchId: number | null;
  lastVerifiedPatchId: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type NormalizedBuildGearSet = {
  weapon: string;
  armor: string;
  accessory: string;
  setName: string;
};

export type NormalizedBuild = {
  characterSlug: string;
  gearSet1: NormalizedBuildGearSet;
  gearSet2?: NormalizedBuildGearSet;
  transcendencePath: string[];
  skillPriority: string[];
  statPriorities: string[];
  keyUsage: string[];
  exclusiveEquipment?: string;
  notes?: string;
};

export type NormalizedGear = {
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type NormalizedPet = {
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type NormalizedTeam = {
  id: number;
  gameId: number;
  slug: string | null;
  name: string;
  characterIds: string;
  synergyScore: number | null;
  powerLevel: number | null;
  purpose: string | null;
  difficulty: string | null;
  evidenceId: number | null;
  gearRecommendations: Record<string, unknown> | null;
  notes: string | null;
  patchId: number | null;
  createdBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type NormalizedTierList = {
  id: number;
  gameId: number;
  slug: string;
  title: string;
  tierType: string | null;
  tiers: string | null;
  createdBy: number | null;
  isCommunity: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type NormalizedTierEntry = {
  id: number;
  gameId: number;
  characterId: number | null;
  petId: number | null;
  mode: string;
  tier: string;
  patchId: number | null;
  previousTier: string | null;
  tierListId: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type NormalizedOverviewStats = {
  heroes: number;
  skills: number;
  gearSets: number;
  pets: number;
  guides: number;
  tierLists: number;
  teams: number;
};

export type GameSeedData = {
  characters: NormalizedCharacter[];
  skills: NormalizedSkill[];
  builds: NormalizedBuild[];
  gear: NormalizedGear[];
  pets: NormalizedPet[];
  teams: NormalizedTeam[];
  tierLists: NormalizedTierList[];
  tierEntries: NormalizedTierEntry[];
};
