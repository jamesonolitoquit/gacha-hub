-- Migration 0002: Add game_taxonomies, gear, pets, hero_stats, tier_entries tables
-- Dependencies: 0001_init.sql must be applied first
-- Applied: 2026-05-22

-- ============================================================================
-- game_taxonomies: Config-driven classifications per game
-- Replaces hardcoded class/rarity/element/tier assumptions in UI
-- ============================================================================
CREATE TABLE IF NOT EXISTS game_taxonomies (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  taxonomy_type VARCHAR(50) NOT NULL,       -- class, rarity, element, tier, stat
  slug VARCHAR(255) NOT NULL,
  label VARCHAR(255) NOT NULL,
  color VARCHAR(7),                         -- hex color like #e74c3c
  icon VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(game_id, taxonomy_type, slug)
);

CREATE INDEX idx_game_taxonomies_game_id ON game_taxonomies(game_id);
CREATE INDEX idx_game_taxonomies_type ON game_taxonomies(taxonomy_type);

COMMENT ON TABLE game_taxonomies IS 'Config-driven classifications per game — classes, rarities, elements, tiers, stats';
COMMENT ON COLUMN game_taxonomies.taxonomy_type IS 'Category: class, rarity, element, tier, stat';
COMMENT ON COLUMN game_taxonomies.metadata IS 'Extra fields per type: stars (rarity), format (stat), tiers list (tier)';

-- ============================================================================
-- gear: Equipment sets
-- ============================================================================
CREATE TABLE IF NOT EXISTS gear (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  source VARCHAR(50),                       -- raid, sudden_raid, advent, special, craft
  two_piece_effect TEXT,
  four_piece_effect TEXT,
  description TEXT,
  icon_url VARCHAR(2048),
  tags TEXT[] DEFAULT '{}',
  patch_id INTEGER REFERENCES patches(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(game_id, slug)
);

CREATE INDEX idx_gear_game_id ON gear(game_id);
CREATE INDEX idx_gear_source ON gear(source);

COMMENT ON TABLE gear IS 'Equipment sets with 2-piece and 4-piece set bonuses';

-- ============================================================================
-- pets: Companion units
-- ============================================================================
CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  rarity VARCHAR(50),                       -- references game_taxonomies.slug WHERE type='rarity'
  faction VARCHAR(50),
  passive1_name VARCHAR(255),
  passive1_description TEXT,
  passive1_enhanced TEXT,
  passive2_name VARCHAR(255),
  passive2_description TEXT,
  passive2_enhanced TEXT,
  icon_url VARCHAR(2048),
  patch_id INTEGER REFERENCES patches(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(game_id, slug)
);

CREATE INDEX idx_pets_game_id ON pets(game_id);
CREATE INDEX idx_pets_rarity ON pets(rarity);

COMMENT ON TABLE pets IS 'Companion units with passive abilities';

-- ============================================================================
-- hero_stats: Character statistics per patch
-- Supports per-game stat systems (ATK, DEF, HP, SPD, Crit, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS hero_stats (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  stat_name VARCHAR(50) NOT NULL,           -- atk, def, hp, spd, crit (matches game_taxonomies slug)
  base_value INTEGER NOT NULL,
  per_level_value DECIMAL(10, 2),
  max_value INTEGER,                        -- At max level + transcendence
  patch_id INTEGER REFERENCES patches(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(character_id, stat_name, patch_id)
);

CREATE INDEX idx_hero_stats_character_id ON hero_stats(character_id);
CREATE INDEX idx_hero_stats_stat_name ON hero_stats(stat_name);

COMMENT ON TABLE hero_stats IS 'Character statistics per stat name per patch';
COMMENT ON COLUMN hero_stats.stat_name IS 'Stat identifier matching game_taxonomies slug';

-- ============================================================================
-- tier_entries: Structured tier rankings per hero per mode per patch
-- Replaces JSON blob pattern in tier_lists.tiers
-- ============================================================================
CREATE TABLE IF NOT EXISTS tier_entries (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  mode VARCHAR(50) NOT NULL,                -- pve, pvp, gvg, guild-war, raid
  tier VARCHAR(10) NOT NULL,                -- SSS, SS, S, A, B, C, D
  patch_id INTEGER REFERENCES patches(id),
  previous_tier VARCHAR(10),                -- For movement tracking: S → A
  tier_list_id INTEGER REFERENCES tier_lists(id),  -- Optional grouping
  notes TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(character_id, mode, patch_id)
);

CREATE INDEX idx_tier_entries_game_id ON tier_entries(game_id);
CREATE INDEX idx_tier_entries_character_id ON tier_entries(character_id);
CREATE INDEX idx_tier_entries_mode ON tier_entries(mode);
CREATE INDEX idx_tier_entries_tier ON tier_entries(tier);

COMMENT ON TABLE tier_entries IS 'Structured tier rankings — each row is one hero in one mode at one patch';
COMMENT ON COLUMN tier_entries.previous_tier IS 'Tier in previous patch; enables ↑/↓ movement tracking';
