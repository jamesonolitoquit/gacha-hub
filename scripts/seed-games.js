const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('Skipping seed: Supabase credentials not configured.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedGames() {
  const games = [
    {
      slug: 'seven-knights-rebirth',
      name: 'Seven Knights: Rebirth',
      subdomain: 'sevenknightsrebirth.gachahub.com',
      description: 'A modern reimagining of the classic Seven Knights RPG experience.',
      status: 'active',
      banner_url: 'https://sgimage.netmarble.com/mobile/game/tskgb/brand/v1/img/1f38443c069c.png',
    },
    {
      slug: 'blue-archive',
      name: 'Blue Archive',
      subdomain: 'bluearchive.gachahub.com',
      description: 'A tactical RPG featuring students from various academies.',
      status: 'beta',
    },
    {
      slug: 'nikke',
      name: 'Goddess of Victory: NIKKE',
      subdomain: 'nikke.gachahub.com',
      description: 'A sci-fi shooter RPG with unique character mechanics.',
      status: 'beta',
    },
    {
      slug: 'brown-dust-2',
      name: 'Brown Dust 2',
      subdomain: 'browndust2.gachahub.com',
      description: 'A retro-style RPG with strategic combat.',
      status: 'beta',
    },
    {
      slug: 'dragon-traveler',
      name: 'Dragon Traveler',
      subdomain: 'dragontraveler.gachahub.com',
      description: 'An adventure RPG with exploration and collection.',
      status: 'beta',
    },
  ];

  for (const game of games) {
    const { data, error } = await supabase
      .from('games')
      .upsert(game, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`Error seeding game ${game.slug}:`, error.message);
    } else {
      console.log(`Seeded game: ${game.name}`);
    }
  }
}

async function main() {
  console.log('Starting database seed...');
  await seedGames();
  console.log('Seed complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
