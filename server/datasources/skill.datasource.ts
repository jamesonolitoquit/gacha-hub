import { skillRepository } from '../repositories/skill.repository';

export class SkillDatasource {
  async getSkillsForCharacter(characterId: number) {
    return skillRepository.findByCharacterId(characterId);
  }

  async getSkillBySlug(gameId: number, slug: string) {
    return skillRepository.findBySlug(gameId, slug);
  }
}

export const skillDatasource = new SkillDatasource();
