-- Migration 0003: ALTER existing tables to match planned schema
-- Dependencies: 0001_init.sql, 0002_add_game_taxonomies_gear_pets_hero_stats_tier_entries.sql
-- Applied: 2026-05-22

-- ============================================================================
-- characters: Add tags and patch awareness columns; change rarity to VARCHAR
-- ============================================================================

ALTER TABLE characters ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS introduced_in_patch_id INTEGER REFERENCES patches(id);
ALTER TABLE characters ADD COLUMN IF NOT EXISTS last_verified_patch_id INTEGER REFERENCES patches(id);

-- Change rarity from INTEGER to VARCHAR to support config-driven rarity slugs
-- Strategy: add new column, migrate data, drop old, rename
ALTER TABLE characters ADD COLUMN IF NOT EXISTS rarity_v2 VARCHAR(50);
UPDATE characters SET rarity_v2 = CAST(rarity AS VARCHAR) WHERE rarity IS NOT NULL;
-- Drop old column and rename (requires dropping dependent indexes first)
-- Note: This is done in separate steps for safety
ALTER TABLE characters DROP CONSTRAINT IF EXISTS characters_rarity_idx;
-- Drop old index by name
DROP INDEX IF EXISTS characters_rarity_idx;
-- Drop old column
ALTER TABLE characters DROP COLUMN IF EXISTS rarity;
-- Rename new column
ALTER TABLE characters RENAME COLUMN rarity_v2 TO rarity;

-- Add index on new rarity column
CREATE INDEX IF NOT EXISTS idx_characters_rarity_v2 ON characters(rarity);

CREATE INDEX IF NOT EXISTS idx_characters_tags ON characters USING GIN(tags);

COMMENT ON COLUMN characters.tags IS 'Flexible tags like debuff, aoe, single-target, heal';
COMMENT ON COLUMN characters.rarity IS 'Rarity slug matching game_taxonomies.slug WHERE type=rarity';
COMMENT ON COLUMN characters.introduced_in_patch_id IS 'First patch this character appeared in';
COMMENT ON COLUMN characters.last_verified_patch_id IS 'Most recent patch confirming this data is current';

-- ============================================================================
-- skills: Add order, enhancement/transcendence, patch awareness columns
-- ============================================================================

ALTER TABLE skills ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS enhancement_text TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS transcendence_text TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS introduced_in_patch_id INTEGER REFERENCES patches(id);
ALTER TABLE skills ADD COLUMN IF NOT EXISTS last_verified_patch_id INTEGER REFERENCES patches(id);

CREATE INDEX IF NOT EXISTS idx_skills_order ON skills("order");
CREATE INDEX IF NOT EXISTS idx_skills_introduced_patch ON skills(introduced_in_patch_id);

COMMENT ON COLUMN skills."order" IS 'Display order: 0=passive, 1=basic, 2=s1, 3=s2, 4=awakened';
COMMENT ON COLUMN skills.enhancement_text IS 'Enhancement effects text (e.g., +10% DMG, +2 turn duration)';
COMMENT ON COLUMN skills.transcendence_text IS 'Transcendence effects text (e.g., Adds Stun for 3 turns)';

-- ============================================================================
-- guides: Add structured frontmatter, mode, boss, power, patch
-- ============================================================================

ALTER TABLE guides ADD COLUMN IF NOT EXISTS frontmatter JSONB DEFAULT '{}';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS mode VARCHAR(50);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS boss VARCHAR(255);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS recommended_power INTEGER;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS patch_id INTEGER REFERENCES patches(id);

CREATE INDEX IF NOT EXISTS idx_guides_mode ON guides(mode);
CREATE INDEX IF NOT EXISTS idx_guides_boss ON guides(boss);
CREATE INDEX IF NOT EXISTS idx_guides_patch_id ON guides(patch_id);

COMMENT ON COLUMN guides.frontmatter IS 'Structured YAML frontmatter: boss, mode, recommendedPower, members, gear';
COMMENT ON COLUMN guides.mode IS 'Game mode: castle-rush, advent, story, raid';
COMMENT ON COLUMN guides.boss IS 'Boss/encounter name this guide targets';
COMMENT ON COLUMN guides.recommended_power IS 'Recommended power level';

-- ============================================================================
-- teams: Add gear_recommendations and patch tracking
-- ============================================================================

ALTER TABLE teams ADD COLUMN IF NOT EXISTS gear_recommendations JSONB DEFAULT '{}';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS patch_id INTEGER REFERENCES patches(id);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_teams_patch_id ON teams(patch_id);

COMMENT ON COLUMN teams.gear_recommendations IS 'Per-member gear assignments: { hero-a: rage-set, hero-b: speed-set }';
COMMENT ON COLUMN teams.notes IS 'Strategy notes, rotation tips, usage context';

-- ============================================================================
-- patches: Already has proper structure; add display_name for nav
-- ============================================================================

ALTER TABLE patches ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);

-- ============================================================================
-- Data migration: Populate tier_entries from existing tier_lists JSON blobs
-- ============================================================================

-- Tier list tiers is a JSON string like: {"S":["Sword Knight"],"A":[],"B":[],"C":[]}
-- Each key is a tier, each value is an array of character names
-- This migrates to structured tier_entries rows

DO $$
DECLARE
  tl RECORD;
  tier_data JSONB;
  tier_key TEXT;
  char_names JSONB;
  char_name TEXT;
  char_id INTEGER;
BEGIN
  FOR tl IN SELECT * FROM tier_lists WHERE tiers IS NOT NULL AND deleted_at IS NULL LOOP
    BEGIN
      tier_data := tl.tiers::JSONB;

      FOR tier_key IN SELECT jsonb_object_keys(tier_data) LOOP
        char_names := tier_data -> tier_key;

        IF jsonb_typeof(char_names) = 'array' THEN
          FOR char_name IN SELECT jsonb_array_elements_text(char_names) LOOP
            -- Try to match by name (case-insensitive, slugified)
            SELECT id INTO char_id FROM characters
              WHERE game_id = tl.game_id
                AND (LOWER(name) = LOWER(char_name)
                     OR slug = LOWER(REPLACE(char_name, ' ', '-')))
              LIMIT 1;

            IF char_id IS NOT NULL THEN
              INSERT INTO tier_entries (game_id, character_id, mode, tier, tier_list_id, created_at)
              VALUES (tl.game_id, char_id, COALESCE(tl.tier_type, 'general'), tier_key, tl.id, NOW())
              ON CONFLICT (character_id, mode, COALESCE(tl.tier_type, 'general'), tl.id)
              DO NOTHING;
            END IF;
          END LOOP;
        END IF;
      END LOOP;
    EXCEPTION WHEN OTHERS THEN
      -- Skip malformed JSON blobs
      NULL;
    END;
  END LOOP;
END $$;

-- ============================================================================
-- Final: Add composite indexes for common query patterns
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_characters_game_class ON characters(game_id, characterClass);
CREATE INDEX IF NOT EXISTS idx_characters_game_element ON characters(game_id, element);

COMMENT ON TABLE tier_entries IS 'Structured tier data migrated from legacy tier_lists.tiers JSON blobs';
