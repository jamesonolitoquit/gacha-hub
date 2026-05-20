import { moduleRegistry } from '../../core/module-registry';

export class SearchRepository {
  findGames(query: string) {
    const normalized = query.trim().toLowerCase();

    return moduleRegistry
      .list()
      .filter((module) => {
        if (!normalized) {
          return true;
        }

        return (
          module.name.toLowerCase().includes(normalized) ||
          module.slug.toLowerCase().includes(normalized) ||
          module.subdomain.toLowerCase().includes(normalized)
        );
      })
      .map((module) => ({
        id: module.id,
        slug: module.slug,
        name: module.name,
        subdomain: module.subdomain,
      }));
  }
}

export const searchRepository = new SearchRepository();
