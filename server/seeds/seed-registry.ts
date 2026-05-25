import { loadSkrData } from './loaders/skr-loader';
import type {
  GameSeedData,
  NormalizedCharacter,
  NormalizedSkill,
  NormalizedBuild,
  NormalizedGear,
  NormalizedPet,
  NormalizedTeam,
  NormalizedTierList,
  NormalizedTierEntry,
  NormalizedOverviewStats,
} from './types';

type LoaderFunction = () => GameSeedData;

const loaders = new Map<string, LoaderFunction>();
loaders.set('seven-knights-rebirth', loadSkrData);

// Future game hub loaders register here:
// loaders.set('dragon-traveler', loadDtData);
// loaders.set('brown-dust-2', loadBd2Data);

class SeedRegistry {
  private cache = new Map<string, GameSeedData>();

  private ensureLoaded(gameSlug: string): GameSeedData {
    const cached = this.cache.get(gameSlug);
    if (cached) return cached;

    const loader = loaders.get(gameSlug);
    if (!loader) {
      const empty: GameSeedData = {
        characters: [],
        skills: [],
        builds: [],
        gear: [],
        pets: [],
        teams: [],
        tierLists: [],
        tierEntries: [],
      };
      this.cache.set(gameSlug, empty);
      return empty;
    }

    const data = loader();
    this.cache.set(gameSlug, data);
    return data;
  }

  getCharacters(gameSlug: string): NormalizedCharacter[] {
    return this.ensureLoaded(gameSlug).characters;
  }

  getSkills(gameSlug: string): NormalizedSkill[] {
    return this.ensureLoaded(gameSlug).skills;
  }

  getBuilds(gameSlug: string): NormalizedBuild[] {
    return this.ensureLoaded(gameSlug).builds;
  }

  getGear(gameSlug: string): NormalizedGear[] {
    return this.ensureLoaded(gameSlug).gear;
  }

  getPets(gameSlug: string): NormalizedPet[] {
    return this.ensureLoaded(gameSlug).pets;
  }

  getTeams(gameSlug: string): NormalizedTeam[] {
    return this.ensureLoaded(gameSlug).teams;
  }

  getTierLists(gameSlug: string): NormalizedTierList[] {
    return this.ensureLoaded(gameSlug).tierLists;
  }

  getTierEntries(gameSlug: string): NormalizedTierEntry[] {
    return this.ensureLoaded(gameSlug).tierEntries;
  }

  getStats(gameSlug: string): NormalizedOverviewStats {
    const data = this.ensureLoaded(gameSlug);
    return {
      heroes: data.characters.length,
      skills: data.skills.length,
      gearSets: data.gear.length,
      pets: data.pets.length,
      guides: 0,
      tierLists: data.tierLists.length,
      teams: data.teams.length,
    };
  }
}

export const seedRegistry = new SeedRegistry();
