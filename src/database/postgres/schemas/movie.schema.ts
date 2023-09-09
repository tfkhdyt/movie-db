import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 50 }).notNull(),
  description: text('description'),
  poster: text('poster'),
  releaseDate: timestamp('release_date', { mode: 'string' }),
});

export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;

export const insertMovieSchema = createInsertSchema(movies);
export const selectUserSchema = createSelectSchema(movies);
