import Elysia from 'elysia';
import { flatten, safeParse } from 'valibot';

import { db } from '../database/postgres';
import {
  insertMovieSchema,
  movies,
} from '../database/postgres/schemas/movie.schema';
import { ValidationError } from '../exceptions/http.exception';
import MovieRepoPostgres from '../repositories/postgres/movie.repo';
import MovieUsecase from '../usecases/movie.usecase';

export const moviePlugin = new Elysia().group('/movies', (app) => {
  const movieRepo = new MovieRepoPostgres(db);
  const movieUsecase = new MovieUsecase(movieRepo);

  app.post('/', async ({ body, set }) => {
    const result = safeParse(insertMovieSchema, body);
    if (!result.success) {
      throw new ValidationError(flatten(result.issues));
    }

    set.status = 201;
    return movieUsecase.insertMovie(result.output);
  });

  app.get('/', async () => {
    const moviesData = await db.select().from(movies);
    return {
      data: moviesData,
    };
  });

  return app;
});
