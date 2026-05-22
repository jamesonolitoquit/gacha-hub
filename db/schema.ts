import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const games = pgTable(
  'games',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    subdomain: varchar('subdomain', { length: 255 }),
    iconUrl: varchar('icon_url', { length: 2048 }),
    bannerUrl: varchar('banner_url', { length: 2048 }),
    description: text('description'),
    status: varchar('status', { length: 50 }),
    releaseDate: timestamp('release_date', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    slugIndex: uniqueIndex('games_slug_unique').on(table.slug),
    statusIndex: index('games_status_idx').on(table.status),
  })
);

export const characters = pgTable(
  'characters',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    rarity: varchar('rarity', { length: 50 }),
    element: varchar('element', { length: 50 }),
    characterClass: varchar('class', { length: 50 }),
    role: varchar('role', { length: 50 }),
    portraitUrl: varchar('portrait_url', { length: 2048 }),
    fullArtUrl: varchar('full_art_url', { length: 2048 }),
    iconUrl: varchar('icon_url', { length: 2048 }),
    description: text('description'),
    tags: text('tags').array(),
    releasePatchId: integer('release_patch_id'),
    introducedInPatchId: integer('introduced_in_patch_id'),
    lastVerifiedPatchId: integer('last_verified_patch_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    gameSlugIndex: uniqueIndex('characters_game_id_slug_unique').on(table.gameId, table.slug),
    gameIndex: index('characters_game_id_idx').on(table.gameId),
    rarityIndex: index('characters_rarity_idx').on(table.rarity),
    elementIndex: index('characters_element_idx').on(table.element),
    tagsIndex: index('characters_tags_idx').on(table.tags),
  })
);

export const skills = pgTable(
  'skills',
  {
    id: serial('id').primaryKey(),
    characterId: integer('character_id').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }),
    description: text('description'),
    cooldownTurns: integer('cooldown_turns'),
    cost: integer('cost'),
    powerType: varchar('power_type', { length: 50 }),
    scalingStat: varchar('scaling_stat', { length: 50 }),
    targets: varchar('targets', { length: 50 }),
    rangeType: varchar('range_type', { length: 50 }),
    order: integer('order').default(0),
    enhancementText: text('enhancement_text'),
    transcendenceText: text('transcendence_text'),
    iconUrl: varchar('icon_url', { length: 2048 }),
    animationUrl: varchar('animation_url', { length: 2048 }),
    introducedInPatchId: integer('introduced_in_patch_id'),
    lastVerifiedPatchId: integer('last_verified_patch_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    characterIndex: index('skills_character_id_idx').on(table.characterId),
    uniqueCharacterSlug: uniqueIndex('skills_character_id_slug_unique').on(table.characterId, table.slug),
    orderIndex: index('skills_order_idx').on(table.order),
  })
);

export const guides = pgTable(
  'guides',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content'),
    summary: varchar('summary', { length: 500 }),
    guideType: varchar('guide_type', { length: 50 }),
    characterId: integer('character_id'),
    author: varchar('author', { length: 255 }),
    isVerified: boolean('is_verified').default(false).notNull(),
    frontmatter: jsonb('frontmatter').default({}),
    mode: varchar('mode', { length: 50 }),
    boss: varchar('boss', { length: 255 }),
    recommendedPower: integer('recommended_power'),
    patchId: integer('patch_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    gameIndex: index('guides_game_id_idx').on(table.gameId),
    characterIndex: index('guides_character_id_idx').on(table.characterId),
    uniqueGameSlug: uniqueIndex('guides_game_id_slug_unique').on(table.gameId, table.slug),
    modeIndex: index('guides_mode_idx').on(table.mode),
    patchIndex: index('guides_patch_id_idx').on(table.patchId),
  })
);

export const tierLists = pgTable(
  'tier_lists',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    tierType: varchar('tier_type', { length: 50 }),
    tiers: text('tiers'),
    createdBy: integer('created_by'),
    isCommunity: boolean('is_community').default(true).notNull(),
    viewCount: integer('view_count').default(0).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    uniqueGameSlug: uniqueIndex('tier_lists_game_id_slug_unique').on(table.gameId, table.slug),
    gameIndex: index('tier_lists_game_id_idx').on(table.gameId),
  })
);

export const teams = pgTable(
  'teams',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    slug: varchar('slug', { length: 255 }),
    name: varchar('name', { length: 255 }).notNull(),
    characterIds: text('character_ids').notNull(),
    synergyScore: integer('synergy_score'),
    powerLevel: integer('power_level'),
    purpose: varchar('purpose', { length: 100 }),
    difficulty: varchar('difficulty', { length: 50 }),
    evidenceId: integer('evidence_id'),
    gearRecommendations: jsonb('gear_recommendations').default({}),
    notes: text('notes'),
    patchId: integer('patch_id'),
    createdBy: integer('created_by'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    gameIndex: index('teams_game_id_idx').on(table.gameId),
    patchIndex: index('teams_patch_id_idx').on(table.patchId),
  })
);

export const patches = pgTable(
  'patches',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    version: varchar('version', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }),
    displayName: varchar('display_name', { length: 255 }),
    notes: text('notes'),
    releaseDate: timestamp('release_date', { mode: 'date' }).notNull(),
    changes: text('changes'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueGameVersion: uniqueIndex('patches_game_id_version_unique').on(table.gameId, table.version),
    gameIndex: index('patches_game_id_idx').on(table.gameId),
  })
);

export const evidence = pgTable(
  'evidence',
  {
    id: serial('id').primaryKey(),
    evidenceType: varchar('evidence_type', { length: 50 }),
    sourceUrl: varchar('source_url', { length: 2048 }),
    sourceHash: varchar('source_hash', { length: 255 }),
    extractedData: text('extracted_data'),
    confidenceScore: integer('confidence_score'),
    aiModel: varchar('ai_model', { length: 100 }),
    gameId: integer('game_id').notNull(),
    patchId: integer('patch_id'),
    claimType: varchar('claim_type', { length: 50 }),
    isVerified: boolean('is_verified').default(false).notNull(),
    verifiedBy: integer('verified_by'),
    verificationNotes: text('verification_notes'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    gameIndex: index('evidence_game_id_idx').on(table.gameId),
    hashIndex: index('evidence_source_hash_idx').on(table.sourceHash),
  })
);

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    username: varchar('username', { length: 255 }),
    authId: varchar('auth_id', { length: 255 }),
    role: varchar('role', { length: 50 }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    emailIndex: uniqueIndex('users_email_unique').on(table.email),
    authIndex: uniqueIndex('users_auth_id_unique').on(table.authId),
  })
);

export const importRuns = pgTable(
  'import_runs',
  {
    id: serial('id').primaryKey(),
    spreadsheetId: varchar('spreadsheet_id', { length: 255 }),
    sourceUrl: varchar('source_url', { length: 2048 }),
    status: varchar('status', { length: 50 }),
    rowCount: integer('row_count'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    spreadsheetIndex: index('import_runs_spreadsheet_idx').on(table.spreadsheetId),
  })
);

export const importsRaw = pgTable(
  'imports_raw',
  {
    id: serial('id').primaryKey(),
    importRunId: integer('import_run_id').notNull(),
    gid: integer('gid'),
    sourceTab: varchar('source_tab', { length: 255 }),
    rawJson: text('raw_json'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    importRunIndex: index('imports_raw_import_run_id_idx').on(table.importRunId),
  })
);

export const gameTaxonomies = pgTable(
  'game_taxonomies',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    taxonomyType: varchar('taxonomy_type', { length: 50 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    label: varchar('label', { length: 255 }).notNull(),
    color: varchar('color', { length: 7 }),
    icon: varchar('icon', { length: 255 }),
    sortOrder: integer('sort_order').default(0),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueGameTypeSlug: uniqueIndex('game_taxonomies_game_type_slug_unique').on(table.gameId, table.taxonomyType, table.slug),
    gameIndex: index('game_taxonomies_game_id_idx').on(table.gameId),
    typeIndex: index('game_taxonomies_type_idx').on(table.taxonomyType),
  })
);

export const gear = pgTable(
  'gear',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    source: varchar('source', { length: 50 }),
    twoPieceEffect: text('two_piece_effect'),
    fourPieceEffect: text('four_piece_effect'),
    description: text('description'),
    iconUrl: varchar('icon_url', { length: 2048 }),
    tags: text('tags').array(),
    patchId: integer('patch_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    uniqueGameSlug: uniqueIndex('gear_game_id_slug_unique').on(table.gameId, table.slug),
    gameIndex: index('gear_game_id_idx').on(table.gameId),
    sourceIndex: index('gear_source_idx').on(table.source),
  })
);

export const pets = pgTable(
  'pets',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    rarity: varchar('rarity', { length: 50 }),
    faction: varchar('faction', { length: 50 }),
    passive1Name: varchar('passive1_name', { length: 255 }),
    passive1Description: text('passive1_description'),
    passive1Enhanced: text('passive1_enhanced'),
    passive2Name: varchar('passive2_name', { length: 255 }),
    passive2Description: text('passive2_description'),
    passive2Enhanced: text('passive2_enhanced'),
    iconUrl: varchar('icon_url', { length: 2048 }),
    patchId: integer('patch_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    uniqueGameSlug: uniqueIndex('pets_game_id_slug_unique').on(table.gameId, table.slug),
    gameIndex: index('pets_game_id_idx').on(table.gameId),
    rarityIndex: index('pets_rarity_idx').on(table.rarity),
  })
);

export const heroStats = pgTable(
  'hero_stats',
  {
    id: serial('id').primaryKey(),
    characterId: integer('character_id').notNull(),
    statName: varchar('stat_name', { length: 50 }).notNull(),
    baseValue: integer('base_value').notNull(),
    perLevelValue: numeric('per_level_value', { precision: 10, scale: 2 }),
    maxValue: integer('max_value'),
    patchId: integer('patch_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueCharacterStatPatch: uniqueIndex('hero_stats_char_stat_patch_unique').on(table.characterId, table.statName, table.patchId),
    characterIndex: index('hero_stats_character_id_idx').on(table.characterId),
    statIndex: index('hero_stats_stat_name_idx').on(table.statName),
  })
);

export const tierEntries = pgTable(
  'tier_entries',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    characterId: integer('character_id').notNull(),
    mode: varchar('mode', { length: 50 }).notNull(),
    tier: varchar('tier', { length: 10 }).notNull(),
    patchId: integer('patch_id'),
    previousTier: varchar('previous_tier', { length: 10 }),
    tierListId: integer('tier_list_id'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    uniqueCharModePatch: uniqueIndex('tier_entries_char_mode_patch_unique').on(table.characterId, table.mode, table.patchId),
    gameIndex: index('tier_entries_game_id_idx').on(table.gameId),
    characterIndex: index('tier_entries_character_id_idx').on(table.characterId),
    modeIndex: index('tier_entries_mode_idx').on(table.mode),
    tierIndex: index('tier_entries_tier_idx').on(table.tier),
  })
);

