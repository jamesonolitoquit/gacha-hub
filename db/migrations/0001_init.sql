-- GachaHub initial database migration
-- Baseline schema for multi-game content platform

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

CREATE INDEX IF NOT EXISTS games_status_idx ON games(status);

CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  rarity INT,
  element VARCHAR(50),
  class VARCHAR(50),
  role VARCHAR(50),
  portrait_url VARCHAR(2048),
  full_art_url VARCHAR(2048),
  icon_url VARCHAR(2048),
  description TEXT,
  release_patch_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(game_id, slug)
);

CREATE INDEX IF NOT EXISTS characters_game_id_idx ON characters(game_id);
CREATE INDEX IF NOT EXISTS characters_rarity_idx ON characters(rarity);
CREATE INDEX IF NOT EXISTS characters_element_idx ON characters(element);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  character_id INT NOT NULL,
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
  icon_url VARCHAR(2048),
  animation_url VARCHAR(2048),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(character_id, slug)
);

CREATE INDEX IF NOT EXISTS skills_character_id_idx ON skills(character_id);

CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL,
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  summary VARCHAR(500),
  guide_type VARCHAR(50),
  character_id INT,
  author VARCHAR(255),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(game_id, slug)
);

CREATE INDEX IF NOT EXISTS guides_game_id_idx ON guides(game_id);
CREATE INDEX IF NOT EXISTS guides_character_id_idx ON guides(character_id);

CREATE TABLE IF NOT EXISTS tier_lists (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL,
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

CREATE INDEX IF NOT EXISTS tier_lists_game_id_idx ON tier_lists(game_id);

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL,
  slug VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  character_ids TEXT NOT NULL,
  synergy_score INT,
  power_level INT,
  purpose VARCHAR(100),
  difficulty VARCHAR(50),
  evidence_id INT,
  created_by INT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS teams_game_id_idx ON teams(game_id);

CREATE TABLE IF NOT EXISTS patches (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL,
  version VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  notes TEXT,
  release_date TIMESTAMP NOT NULL,
  changes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(game_id, version)
);

CREATE INDEX IF NOT EXISTS patches_game_id_idx ON patches(game_id);
CREATE INDEX IF NOT EXISTS patches_release_date_idx ON patches(release_date);

CREATE TABLE IF NOT EXISTS evidence (
  id SERIAL PRIMARY KEY,
  evidence_type VARCHAR(50),
  source_url VARCHAR(2048),
  source_hash VARCHAR(255),
  extracted_data TEXT,
  confidence_score INT,
  ai_model VARCHAR(100),
  game_id INT NOT NULL,
  patch_id INT,
  claim_type VARCHAR(50),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by INT,
  verification_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS evidence_game_id_idx ON evidence(game_id);
CREATE INDEX IF NOT EXISTS evidence_source_hash_idx ON evidence(source_hash);

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
