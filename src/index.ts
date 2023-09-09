import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { Elysia } from 'elysia';
import { flatten, safeParse } from 'valibot';

import { db, migrationClient } from './database/postgres';
import {
  insertMovieSchema,
  moviesSchema,
} from './database/postgres/schemas/book.schema';

await migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' });

const app = new Elysia();

app.post('/movies', async ({ body, set }) => {
  try {
    const result = safeParse(insertMovieSchema, body);
    if (!result.success) {
      set.status = 422;
      return {
        error: flatten(result.issues),
      };
    }

    const createdMovie = await db
      .insert(moviesSchema)
      .values(result.output)
      .returning();

    set.status = 201;
    return {
      message: 'New movie has been inserted successfully',
      data: createdMovie[0],
    };
  } catch (error) {
    if (error instanceof Error) {
      set.status = 500;
      return {
        error: error.message,
      };
    }
  }
});

app.get('/movies', async () => {
  const movies = await db.select().from(moviesSchema);
  return {
    data: movies,
  };
});

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
