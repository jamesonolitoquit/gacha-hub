-- Migration 0005: Add pet_id to tier_entries for pet tier lists
-- Dependencies: 0002_add_game_taxonomies_gear_pets_hero_stats_tier_entries.sql must be applied first

ALTER TABLE tier_entries ALTER COLUMN character_id DROP NOT NULL;

ALTER TABLE tier_entries ADD COLUMN pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_tier_entries_character_id;
CREATE INDEX IF NOT EXISTS idx_tier_entries_pet_id ON tier_entries(pet_id);

ALTER TABLE tier_entries DROP CONSTRAINT IF EXISTS tier_entries_character_id_mode_patch_id_key;
DROP INDEX IF EXISTS tier_entries_character_id_mode_patch_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_tier_entries_char_unique ON tier_entries(character_id, mode, patch_id) WHERE character_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_tier_entries_pet_unique ON tier_entries(pet_id, mode, patch_id) WHERE pet_id IS NOT NULL;

COMMENT ON COLUMN tier_entries.pet_id IS 'Optional pet reference for pet tier lists (mutually exclusive with character_id)';
