import { skillRepository } from '../repositories/skill.repository';
import { characterRepository } from '../repositories/character.repository';

export class SkillService {
  async listSkillsForCharacter(characterId: number) {
    return skillRepository.findByCharacterId(characterId);
  }

  async getSkill(gameId: number, slug: string) {
    return skillRepository.findBySlug(gameId, slug);
  }

  async listSkillsForGame(gameId: number) {
    const characters = await characterRepository.findByGameId(gameId);

    const grouped = await Promise.all(
      characters.map(async (char) => {
        const skills = await skillRepository.findByCharacterId(char.id);
        return {
          characterId: char.id,
          characterSlug: char.slug,
          characterName: char.name,
          skills,
        };
      })
    );

    return grouped;
  }
}

export const skillService = new SkillService();