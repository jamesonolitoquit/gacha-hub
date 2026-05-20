import {
  boolean,
  index,
  integer,
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
    rarity: integer('rarity'),
    element: varchar('element', { length: 50 }),
    characterClass: varchar('class', { length: 50 }),
    role: varchar('role', { length: 50 }),
    portraitUrl: varchar('portrait_url', { length: 2048 }),
    fullArtUrl: varchar('full_art_url', { length: 2048 }),
    iconUrl: varchar('icon_url', { length: 2048 }),
    description: text('description'),
    releasePatchId: integer('release_patch_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    gameSlugIndex: uniqueIndex('characters_game_id_slug_unique').on(table.gameId, table.slug),
    gameIndex: index('characters_game_id_idx').on(table.gameId),
    rarityIndex: index('characters_rarity_idx').on(table.rarity),
    elementIndex: index('characters_element_idx').on(table.element),
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
    iconUrl: varchar('icon_url', { length: 2048 }),
    animationUrl: varchar('animation_url', { length: 2048 }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    characterIndex: index('skills_character_id_idx').on(table.characterId),
    uniqueCharacterSlug: uniqueIndex('skills_character_id_slug_unique').on(table.characterId, table.slug),
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
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    gameIndex: index('guides_game_id_idx').on(table.gameId),
    characterIndex: index('guides_character_id_idx').on(table.characterId),
    uniqueGameSlug: uniqueIndex('guides_game_id_slug_unique').on(table.gameId, table.slug),
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
    createdBy: integer('created_by'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    gameIndex: index('teams_game_id_idx').on(table.gameId),
  })
);

export const patches = pgTable(
  'patches',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').notNull(),
    version: varchar('version', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }),
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

