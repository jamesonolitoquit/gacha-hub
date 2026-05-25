import { getGameSlugById } from '../bootstrap-data';
import { seedRegistry } from '../seeds/seed-registry';

export type BuildGearSet = {
  weapon: string;
  armor: string;
  accessory: string;
  setName: string;
};

export type BuildData = {
  characterSlug: string;
  gearSet1: BuildGearSet;
  gearSet2?: BuildGearSet;
  transcendencePath: string[];
  skillPriority: string[];
  statPriorities: string[];
  keyUsage: string[];
  exclusiveEquipment?: string;
  notes?: string;
};

export class BuildService {
  async listBuilds(gameId: number): Promise<BuildData[]> {
    const slug = getGameSlugById(gameId);
    if (!slug) return [];
    return seedRegistry.getBuilds(slug) as BuildData[];
  }

  async getBuildForCharacter(gameId: number, characterSlug: string): Promise<BuildData | null> {
    const slug = getGameSlugById(gameId);
    if (!slug) return null;
    const builds = seedRegistry.getBuilds(slug);
    const seed = builds.find((b) => b.characterSlug === characterSlug) ?? null;
    if (!seed) return null;

    return {
      characterSlug: seed.characterSlug,
      gearSet1: seed.gearSet1,
      gearSet2: seed.gearSet2,
      transcendencePath: seed.transcendencePath ?? [],
      skillPriority: seed.skillPriority ?? [],
      statPriorities: seed.statPriorities ?? [],
      keyUsage: seed.keyUsage ?? [],
      exclusiveEquipment: seed.exclusiveEquipment,
      notes: seed.notes,
    };
  }
}

export const buildService = new BuildService();
