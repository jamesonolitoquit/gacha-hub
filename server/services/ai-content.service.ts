import { evidenceService } from './evidence.service';
import { characterService } from './character.service';
import { skillService } from './skill.service';

export type ExtractionResult = {
  entityType: 'character' | 'skill' | 'stat';
  data: Record<string, unknown>;
  confidence: number;
  requiresReview: boolean;
};

export class AIContentService {
  async processEvidence(
    gameId: number,
    sourceUrl: string,
    sourceHash: string,
    extractedData: Record<string, unknown>,
    aiModel: string
  ): Promise<ExtractionResult[]> {
    const results: ExtractionResult[] = [];

    const characterName = (extractedData.characterName as string) ?? null;
    const skillName = (extractedData.skillName as string) ?? null;
    const stats = (extractedData.stats as Record<string, number>) ?? {};

    if (characterName) {
      const characterSlug = this.slugify(characterName);
      const existingCharacter = await characterService.getCharacter(gameId, characterSlug);

      results.push({
        entityType: 'character',
        data: {
          name: characterName,
          slug: characterSlug,
          gameId,
          ...extractedData,
        },
        confidence: existingCharacter ? 0.95 : 0.7,
        requiresReview: !existingCharacter,
      });
    }

    if (skillName && characterName) {
      const characterSlug = this.slugify(characterName);
      const character = await characterService.getCharacter(gameId, characterSlug);

      results.push({
        entityType: 'skill',
        data: {
          name: skillName,
          slug: this.slugify(skillName),
          characterId: character?.id,
          ...extractedData,
        },
        confidence: character ? 0.85 : 0.5,
        requiresReview: !character,
      });
    }

    for (const [statName, statValue] of Object.entries(stats)) {
      results.push({
        entityType: 'stat',
        data: {
          statName,
          statValue,
          ...extractedData,
        },
        confidence: 0.8,
        requiresReview: false,
      });
    }

    await evidenceService.createEvidence({
      evidenceType: 'screenshot',
      sourceUrl,
      sourceHash,
      extractedData: JSON.stringify(extractedData),
      confidenceScore: Math.round(this.averageConfidence(results) * 100),
      aiModel,
      gameId,
      claimType: results[0]?.entityType ?? 'unknown',
      isVerified: results.every((r) => !r.requiresReview),
    });

    return results;
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private averageConfidence(results: ExtractionResult[]): number {
    if (results.length === 0) return 0;
    return results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
  }
}

export const aiContentService = new AIContentService();
