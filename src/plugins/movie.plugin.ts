import Elysia, { t } from 'elysia';
import { safeParse } from 'valibot';

import { db } from '../database/postgres';
import {
  insertMovieSchema,
  updateMovieSchema,
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
      throw new ValidationError(result.issues);
    }

    set.status = 201;
    return movieUsecase.insertMovie(result.output);
  });

  app.get('/', async () => {
    return movieUsecase.findAllMovies();
  });

  app.get(
    '/:id',
    async ({ params: { id } }) => {
      return movieUsecase.findMovieByID(id);
    },
    {
      params: t.Object({
        id: t.Numeric({ error: 'Movie id must be a numeric' }),
      }),
    },
  );

  app.put(
    '/:id',
    ({ params: { id }, body }) => {
      const result = safeParse(updateMovieSchema, body);
      if (!result.success) {
        throw new ValidationError(result.issues);
      }

      return movieUsecase.updateMovie(id, result.output);
    },
    {
      params: t.Object({
        id: t.Numeric({ error: 'Movie id must be a numeric' }),
      }),
    },
  );

  return app;
});
