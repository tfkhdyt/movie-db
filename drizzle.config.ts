import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/postgres/schemas/*',
  out: './drizzle',
} satisfies Config;
