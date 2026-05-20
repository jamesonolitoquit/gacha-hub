import { skillRepository } from '../repositories/skill.repository';

export class SkillService {
  async listSkillsForCharacter(characterId: number) {
    return skillRepository.findByCharacterId(characterId);
  }

  async getSkill(gameId: number, slug: string) {
    return skillRepository.findBySlug(gameId, slug);
  }
}

export const skillService = new SkillService();