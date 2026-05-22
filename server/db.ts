import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getEnvValue(...keys: Array<string>) {
	for (const key of keys) {
		const value = process.env[key];

		if (value) {
			return value;
		}
	}

	return '';
}

export function isDatabaseConfigured() {
	const supabaseUrl = getEnvValue('SUPABASE_URL');
	const supabaseKey = getEnvValue('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY');

	return Boolean(supabaseUrl && supabaseKey);
}

export function createDatabaseClient(): SupabaseClient | null {
	const supabaseUrl = getEnvValue('SUPABASE_URL');
	const supabaseKey = getEnvValue('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY');

	if (!supabaseUrl || !supabaseKey) {
		return null;
	}

	return createClient(supabaseUrl, supabaseKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
		global: {
			headers: {
				'x-application-name': 'gachahub',
			},
		},
		db: {
			timeout: 10000,
		},
	});
}

export const db = createDatabaseClient();
