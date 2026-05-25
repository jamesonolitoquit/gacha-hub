export const routes = {
  hero(gameSlug: string, heroSlug: string) {
    return `/games/${gameSlug}/heroes/${heroSlug}` as const;
  },
  heroIndex(gameSlug: string) {
    return `/games/${gameSlug}/heroes` as const;
  },
  tierList(gameSlug: string, tierSlug: string) {
    return `/games/${gameSlug}/tier-lists/${tierSlug}` as const;
  },
  tierListIndex(gameSlug: string) {
    return `/games/${gameSlug}/tier-lists` as const;
  },
  guide(gameSlug: string, guideSlug: string) {
    return `/games/${gameSlug}/guides/${guideSlug}` as const;
  },
  guideIndex(gameSlug: string) {
    return `/games/${gameSlug}/guides` as const;
  },
  team(gameSlug: string, teamSlug: string) {
    return `/games/${gameSlug}/teams/${teamSlug}` as const;
  },
  teamIndex(gameSlug: string) {
    return `/games/${gameSlug}/teams` as const;
  },
  patch(gameSlug: string, version: string) {
    return `/games/${gameSlug}/patches/${version}` as const;
  },
  patchIndex(gameSlug: string) {
    return `/games/${gameSlug}/patches` as const;
  },
  gear(gameSlug: string, gearSlug: string) {
    return `/games/${gameSlug}/database/gear/${gearSlug}` as const;
  },
  gearIndex(gameSlug: string) {
    return `/games/${gameSlug}/database/gear` as const;
  },
  pet(gameSlug: string, petSlug: string) {
    return `/games/${gameSlug}/database/pets/${petSlug}` as const;
  },
  petIndex(gameSlug: string) {
    return `/games/${gameSlug}/database/pets` as const;
  },
  builds(gameSlug: string) {
    return `/games/${gameSlug}/builds` as const;
  },
  database(gameSlug: string) {
    return `/games/${gameSlug}/database` as const;
  },
  tools(gameSlug: string) {
    return `/games/${gameSlug}/tools` as const;
  },
  gameHome(gameSlug: string) {
    return `/games/${gameSlug}` as const;
  },
};
