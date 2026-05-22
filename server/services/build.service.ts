import { getSeedBuilds, findSeedBuildForCharacter } from '../bootstrap-data';

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
    return getSeedBuilds(gameId) as BuildData[];
  }

  async getBuildForCharacter(gameId: number, characterSlug: string): Promise<BuildData | null> {
    const seed = findSeedBuildForCharacter(gameId, characterSlug);
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
