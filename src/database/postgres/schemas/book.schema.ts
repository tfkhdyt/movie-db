import { pgTable, text, timestamp, varchar, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';

export const moviesSchema = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 50 }).notNull(),
  description: text('description'),
  poster: text('poster'),
  releaseDate: timestamp('release_date', { mode: 'string' }),
});

export type User = typeof moviesSchema.$inferSelect;
export type NewUser = typeof moviesSchema.$inferInsert;

export const insertMovieSchema = createInsertSchema(moviesSchema);
export const selectUserSchema = createSelectSchema(moviesSchema);
