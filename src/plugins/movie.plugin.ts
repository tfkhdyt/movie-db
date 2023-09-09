import Elysia from 'elysia';
import { safeParse } from 'valibot';

import { db } from '../database/postgres';
import { insertMovieSchema } from '../database/postgres/schemas/movie.schema';
import { ValidationError } from '../exceptions/http.exception';
import MovieRepoPostgres from '../repositories/postgres/movie.repo';
import MovieUsecase from '../usecases/movie.usecase';

export const moviePlugin = new Elysia().group('/movies', (app) => {
  const movieRepo = new MovieRepoPostgres(db);
  const movieUsecase = new MovieUsecase(movieRepo);

  app.post('/', async ({ body, set }) => {
    const result = safeParse(insertMovieSchema, body);
    if (!result.success) {
      throw new ValidationError(result.issues.map((err) => err.message));
    }

    set.status = 201;
    return movieUsecase.insertMovie(result.output);
  });

  app.get('/', async () => {
    return movieUsecase.findAllMovies();
  });

  return app;
});
