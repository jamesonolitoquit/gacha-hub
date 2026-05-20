import type { GameModule } from './types';

class ModuleRegistry {
  private readonly modulesBySlug = new Map<string, GameModule>();
  private readonly modulesById = new Map<string, GameModule>();
  private readonly modulesBySubdomain = new Map<string, GameModule>();

  register(module: GameModule) {
    this.modulesBySlug.set(module.slug, module);
    this.modulesById.set(module.id, module);
    this.modulesBySubdomain.set(module.subdomain, module);
  }

  get(gameSlug: string) {
    return this.modulesBySlug.get(gameSlug) ?? this.modulesById.get(gameSlug) ?? this.modulesBySubdomain.get(gameSlug);
  }

  findByHost(host?: string) {
    if (!host) {
      return undefined;
    }

    const normalizedHost = host.split(':')[0]?.toLowerCase() ?? '';
    const hostname = normalizedHost.startsWith('www.') ? normalizedHost.slice(4) : normalizedHost;
    const hostPrefix = hostname.split('.')[0] ?? '';

    return this.modulesBySubdomain.get(hostname) ?? this.modulesById.get(hostPrefix) ?? this.modulesBySlug.get(hostPrefix);
  }

  list() {
    return Array.from(this.modulesBySlug.values());
  }
}

export const moduleRegistry = new ModuleRegistry();
