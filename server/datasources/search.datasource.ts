import { searchRepository } from '../repositories/search.repository';
import { characterDatasource } from './character.datasource';
import { guideDatasource } from './guide.datasource';

export type SearchResult = {
  type: 'game' | 'character' | 'guide';
  id: number;
  title: string;
  slug: string;
  gameSlug?: string;
};

export class SearchDatasource {
  async search(query: string, gameId?: number): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    const games = searchRepository.findGames(query);
    for (const game of games) {
      results.push({
        type: 'game',
        id: 0,
        title: game.name,
        slug: game.slug,
        gameSlug: game.slug,
      });
    }

    if (gameId) {
      const characters = await characterDatasource.getCharactersForGame(gameId);
      const filteredChars = query
        ? characters.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.slug.toLowerCase().includes(query.toLowerCase()))
        : characters;

      for (const char of filteredChars.slice(0, 20)) {
        results.push({
          type: 'character',
          id: char.id,
          title: char.name,
          slug: char.slug,
          gameSlug: undefined,
        });
      }

      const guides = await guideDatasource.getGuidesForGame(gameId);
      const filteredGuides = query
        ? guides.filter((g) => g.title.toLowerCase().includes(query.toLowerCase()) || g.slug.toLowerCase().includes(query.toLowerCase()))
        : guides;

      for (const guide of filteredGuides.slice(0, 10)) {
        results.push({
          type: 'guide',
          id: guide.id,
          title: guide.title,
          slug: guide.slug,
          gameSlug: undefined,
        });
      }
    }

    return results;
  }
}

export const searchDatasource = new SearchDatasource();
