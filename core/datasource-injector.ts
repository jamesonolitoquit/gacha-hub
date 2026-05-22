import { gameDatasource } from '../server/datasources/game.datasource';
import { characterDatasource } from '../server/datasources/character.datasource';
import { skillDatasource } from '../server/datasources/skill.datasource';
import { guideDatasource } from '../server/datasources/guide.datasource';
import { tierListDatasource } from '../server/datasources/tier-list.datasource';
import { patchDatasource } from '../server/datasources/patch.datasource';
import { searchDatasource } from '../server/datasources/search.datasource';
import { evidenceDatasource } from '../server/datasources/evidence.datasource';
import { teamDatasource } from '../server/datasources/team.datasource';

export const datasources = {
  game: gameDatasource,
  character: characterDatasource,
  skill: skillDatasource,
  guide: guideDatasource,
  tierList: tierListDatasource,
  patch: patchDatasource,
  search: searchDatasource,
  evidence: evidenceDatasource,
  team: teamDatasource,
};

export type DatasourceRegistry = typeof datasources;

export function getDatasource<TKey extends keyof DatasourceRegistry>(key: TKey): DatasourceRegistry[TKey] {
  return datasources[key];
}
