-- Migration: 001_init_schema
-- Created: 2026-05-21
-- Description: Initial database schema for GachaHub

CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(255),
  icon_url VARCHAR(2048),
  banner_url VARCHAR(2048),
  description TEXT,
  status VARCHAR(50),
  release_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS games_slug_unique ON games(slug);
CREATE INDEX IF NOT EXISTS games_status_idx ON games(status);

CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  rarity INTEGER,
  element VARCHAR(50),
  class VARCHAR(50),
  role VARCHAR(50),
  portrait_url VARCHAR(2048),
  full_art_url VARCHAR(2048),
  icon_url VARCHAR(2048),
  description TEXT,
  release_patch_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS characters_game_id_slug_unique ON characters(game_id, slug);
CREATE INDEX IF NOT EXISTS characters_game_id_idx ON characters(game_id);
CREATE INDEX IF NOT EXISTS characters_rarity_idx ON characters(rarity);
CREATE INDEX IF NOT EXISTS characters_element_idx ON characters(element);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  description TEXT,
  cooldown_turns INTEGER,
  cost INTEGER,
  power_type VARCHAR(50),
  scaling_stat VARCHAR(50),
  targets VARCHAR(50),
  range_type VARCHAR(50),
  icon_url VARCHAR(2048),
  animation_url VARCHAR(2048),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS skills_character_id_idx ON skills(character_id);
CREATE UNIQUE INDEX IF NOT EXISTS skills_character_id_slug_unique ON skills(character_id, slug);

CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL,
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  summary VARCHAR(500),
  guide_type VARCHAR(50),
  character_id INTEGER,
  author VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS guides_game_id_idx ON guides(game_id);
CREATE INDEX IF NOT EXISTS guides_character_id_idx ON guides(character_id);
CREATE UNIQUE INDEX IF NOT EXISTS guides_game_id_slug_unique ON guides(game_id, slug);

CREATE TABLE IF NOT EXISTS tier_lists (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL,
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  tier_type VARCHAR(50),
  tiers TEXT,
  created_by INTEGER,
  is_community BOOLEAN DEFAULT TRUE NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS tier_lists_game_id_slug_unique ON tier_lists(game_id, slug);
CREATE INDEX IF NOT EXISTS tier_lists_game_id_idx ON tier_lists(game_id);

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL,
  slug VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  character_ids TEXT NOT NULL,
  synergy_score INTEGER,
  power_level INTEGER,
  purpose VARCHAR(100),
  difficulty VARCHAR(50),
  evidence_id INTEGER,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS teams_game_id_idx ON teams(game_id);

CREATE TABLE IF NOT EXISTS patches (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL,
  version VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  notes TEXT,
  release_date TIMESTAMP NOT NULL,
  changes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS patches_game_id_version_unique ON patches(game_id, version);
CREATE INDEX IF NOT EXISTS patches_game_id_idx ON patches(game_id);

CREATE TABLE IF NOT EXISTS evidence (
  id SERIAL PRIMARY KEY,
  evidence_type VARCHAR(50),
  source_url VARCHAR(2048),
  source_hash VARCHAR(255),
  extracted_data TEXT,
  confidence_score INTEGER,
  ai_model VARCHAR(100),
  game_id INTEGER NOT NULL,
  patch_id INTEGER,
  claim_type VARCHAR(50),
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  verified_by INTEGER,
  verification_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS evidence_game_id_idx ON evidence(game_id);
CREATE INDEX IF NOT EXISTS evidence_source_hash_idx ON evidence(source_hash);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  auth_id VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS users_auth_id_unique ON users(auth_id);

CREATE TABLE IF NOT EXISTS import_runs (
  id SERIAL PRIMARY KEY,
  spreadsheet_id VARCHAR(255),
  source_url VARCHAR(2048),
  status VARCHAR(50),
  row_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS import_runs_spreadsheet_idx ON import_runs(spreadsheet_id);

CREATE TABLE IF NOT EXISTS imports_raw (
  id SERIAL PRIMARY KEY,
  import_run_id INTEGER NOT NULL,
  gid INTEGER,
  source_tab VARCHAR(255),
  raw_json TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS imports_raw_import_run_id_idx ON imports_raw(import_run_id);
