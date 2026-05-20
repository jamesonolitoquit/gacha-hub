import { moduleRegistry } from '../core/module-registry';
import { sevenKnightsRebirthModule } from '../games/seven-knights-rebirth/module';
import { dragonTravelerModule } from '../games/dragon-traveler/module';
import { brownDust2Module } from '../games/brown-dust-2/module';

moduleRegistry.register(sevenKnightsRebirthModule);
moduleRegistry.register(dragonTravelerModule);
moduleRegistry.register(brownDust2Module);

export const gameModules = moduleRegistry.list();
