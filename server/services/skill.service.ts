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
    const characterIds = characters.map((c) => c.id);
    const allSkills = await skillRepository.findByCharacterIds(characterIds);

    const groupedByCharId = new Map<number, typeof allSkills>();
    for (const skill of allSkills) {
      if (!groupedByCharId.has(skill.characterId)) {
        groupedByCharId.set(skill.characterId, []);
      }
      groupedByCharId.get(skill.characterId)!.push(skill);
    }

    return characters.map((char) => ({
      characterId: char.id,
      characterSlug: char.slug,
      characterName: char.name,
      skills: groupedByCharId.get(char.id) ?? [],
    }));
  }
}

export const skillService = new SkillService();