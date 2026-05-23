-- GachaHub combined schema migration
-- Combines 0001 + 0002 + 0003 for fresh databases
-- All tables use final column definitions (no ALTER needed)

-- ============================================================================
-- games: Multi-game platform root
-- ============================================================================
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(255) UNIQUE,
  icon_url VARCHAR(2048),
  banner_url VARCHAR(2048),
  description TEXT,
  status VARCHAR(50),
  release_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);

-- ============================================================================
-- patches: Game version/update tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS patches (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  display_name VARCHAR(255),
  notes TEXT,
  release_date TIMESTAMP NOT NULL,
  changes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(game_id, version)
);

CREATE INDEX IF NOT EXISTS idx_patches_game_id ON patches(game_id);
CREATE INDEX IF NOT EXISTS idx_patches_release_date ON patches(release_date);

-- ============================================================================
-- characters: Game heroes/units
-- ============================================================================
CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  rarity VARCHAR(50),
  element VARCHAR(50),
  class VARCHAR(50),
  role VARCHAR(50),
  portrait_url VARCHAR(2048),
  full_art_url VARCHAR(2048),
  icon_url VARCHAR(2048),
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  release_patch_id INT REFERENCES patches(id),
  introduced_in_patch_id INT REFERENCES patches(id),
  last_verified_patch_id INT REFERENCES patches(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(game_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_characters_game_id ON characters(game_id);
CREATE INDEX IF NOT EXISTS idx_characters_rarity ON characters(rarity);
CREATE INDEX IF NOT EXISTS idx_characters_element ON characters(element);
CREATE INDEX IF NOT EXISTS idx_characters_tags ON characters USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_characters_game_class ON characters(game_id, class);
CREATE INDEX IF NOT EXISTS idx_characters_game_element ON characters(game_id, element);

-- ============================================================================
-- skills: Character abilities
-- ============================================================================
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  character_id INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  description TEXT,
  cooldown_turns INT,
  cost INT,
  power_type VARCHAR(50),
  scaling_stat VARCHAR(50),
  targets VARCHAR(50),
  range_type VARCHAR(50),
  "order" INT DEFAULT 0,
  enhancement_text TEXT,
  transcendence_text TEXT,
  icon_url VARCHAR(2048),
  animation_url VARCHAR(2048),
  introduced_in_patch_id INT REFERENCES patches(id),
  last_verified_patch_id INT REFERENCES patches(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(character_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_skills_character_id ON skills(character_id);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills("order");

-- ============================================================================
-- guides: Strategy/tutorial content
-- ============================================================================
CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  summary VARCHAR(500),
  guide_type VARCHAR(50),
  character_id INT REFERENCES characters(id),
  author VARCHAR(255),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  frontmatter JSONB DEFAULT '{}',
  mode VARCHAR(50),
  boss VARCHAR(255),
  recommended_power INT,
  patch_id INT REFERENCES patches(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(game_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_guides_game_id ON guides(game_id);
CREATE INDEX IF NOT EXISTS idx_guides_character_id ON guides(character_id);
CREATE INDEX IF NOT EXISTS idx_guides_mode ON guides(mode);
CREATE INDEX IF NOT EXISTS idx_guides_patch_id ON guides(patch_id);

-- ============================================================================
-- tier_lists: Tier list headers
-- ============================================================================
CREATE TABLE IF NOT EXISTS tier_lists (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  tier_type VARCHAR(50),
  tiers TEXT,
  created_by INT,
  is_community BOOLEAN NOT NULL DEFAULT TRUE,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(game_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_tier_lists_game_id ON tier_lists(game_id);

-- ============================================================================
-- teams: Pre-built team compositions
-- ============================================================================
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  slug VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  character_ids TEXT NOT NULL,
  synergy_score INT,
  power_level INT,
  purpose VARCHAR(100),
  difficulty VARCHAR(50),
  evidence_id INT,
  gear_recommendations JSONB DEFAULT '{}',
  notes TEXT,
  patch_id INT REFERENCES patches(id),
  created_by INT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teams_game_id ON teams(game_id);
CREATE INDEX IF NOT EXISTS idx_teams_patch_id ON teams(patch_id);

-- ============================================================================
-- evidence: Data source tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS evidence (
  id SERIAL PRIMARY KEY,
  evidence_type VARCHAR(50),
  source_url VARCHAR(2048),
  source_hash VARCHAR(255),
  extracted_data TEXT,
  confidence_score INT,
  ai_model VARCHAR(100),
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  patch_id INT REFERENCES patches(id),
  claim_type VARCHAR(50),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by INT,
  verification_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_game_id ON evidence(game_id);
CREATE INDEX IF NOT EXISTS idx_evidence_source_hash ON evidence(source_hash);

-- ============================================================================
-- users: Admin/contributor accounts
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE,
  auth_id VARCHAR(255) UNIQUE,
  role VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- ============================================================================
-- game_taxonomies: Config-driven classifications per game
-- ============================================================================
CREATE TABLE IF NOT EXISTS game_taxonomies (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  taxonomy_type VARCHAR(50) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  label VARCHAR(255) NOT NULL,
  color VARCHAR(7),
  icon VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(game_id, taxonomy_type, slug)
);

CREATE INDEX IF NOT EXISTS idx_game_taxonomies_game_id ON game_taxonomies(game_id);
CREATE INDEX IF NOT EXISTS idx_game_taxonomies_type ON game_taxonomies(taxonomy_type);

-- ============================================================================
-- gear: Equipment sets
-- ============================================================================
CREATE TABLE IF NOT EXISTS gear (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  source VARCHAR(50),
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

CREATE INDEX IF NOT EXISTS idx_gear_game_id ON gear(game_id);
CREATE INDEX IF NOT EXISTS idx_gear_source ON gear(source);

-- ============================================================================
-- pets: Companion units
-- ============================================================================
CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  rarity VARCHAR(50),
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

CREATE INDEX IF NOT EXISTS idx_pets_game_id ON pets(game_id);
CREATE INDEX IF NOT EXISTS idx_pets_rarity ON pets(rarity);

-- ============================================================================
-- hero_stats: Character statistics per patch
-- ============================================================================
CREATE TABLE IF NOT EXISTS hero_stats (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  stat_name VARCHAR(50) NOT NULL,
  base_value INTEGER NOT NULL,
  per_level_value DECIMAL(10, 2),
  max_value INTEGER,
  patch_id INTEGER REFERENCES patches(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(character_id, stat_name, patch_id)
);

CREATE INDEX IF NOT EXISTS idx_hero_stats_character_id ON hero_stats(character_id);
CREATE INDEX IF NOT EXISTS idx_hero_stats_stat_name ON hero_stats(stat_name);

-- ============================================================================
-- tier_entries: Structured tier rankings
-- ============================================================================
CREATE TABLE IF NOT EXISTS tier_entries (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE,
  mode VARCHAR(50) NOT NULL,
  tier VARCHAR(10) NOT NULL,
  patch_id INTEGER REFERENCES patches(id),
  previous_tier VARCHAR(10),
  tier_list_id INTEGER REFERENCES tier_lists(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tier_entries_game_id ON tier_entries(game_id);
CREATE INDEX IF NOT EXISTS idx_tier_entries_character_id ON tier_entries(character_id);
CREATE INDEX IF NOT EXISTS idx_tier_entries_pet_id ON tier_entries(pet_id);
CREATE INDEX IF NOT EXISTS idx_tier_entries_mode ON tier_entries(mode);
CREATE INDEX IF NOT EXISTS idx_tier_entries_tier ON tier_entries(tier);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tier_entries_char_unique ON tier_entries(character_id, mode, patch_id) WHERE character_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_tier_entries_pet_unique ON tier_entries(pet_id, mode, patch_id) WHERE pet_id IS NOT NULL;

-- ============================================================================
-- import_runs: Admin import tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS import_runs (
  id SERIAL PRIMARY KEY,
  spreadsheet_id VARCHAR(255),
  source_url VARCHAR(2048),
  status VARCHAR(50),
  row_count INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_import_runs_spreadsheet ON import_runs(spreadsheet_id);

-- ============================================================================
-- imports_raw: Raw admin import data
-- ============================================================================
CREATE TABLE IF NOT EXISTS imports_raw (
  id SERIAL PRIMARY KEY,
  import_run_id INT NOT NULL REFERENCES import_runs(id) ON DELETE CASCADE,
  gid INT,
  source_tab VARCHAR(255),
  raw_json TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_imports_raw_run_id ON imports_raw(import_run_id);
