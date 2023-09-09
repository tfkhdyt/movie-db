import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import {
  isoTimestamp,
  maxLength,
  minLength,
  object,
  optional,
  string,
  url,
} from 'valibot';

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 50 }).notNull(),
  description: text('description'),
  poster: text('poster'),
  releaseDate: timestamp('release_date', { mode: 'string' }),
});

export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;

export const insertMovieSchema = object({
  title: string('Title must be a string', [
    minLength(1, 'Title cannot be empty'),
    maxLength(50, 'Title should be less than 50 character'),
  ]),
  description: optional(string('Description must be a string')),
  poster: optional(
    string('Poster must be a string', [url('Invalid poster image URl')]),
  ),
  releaseDate: optional(string([isoTimestamp('Invalid release date')])),
});
