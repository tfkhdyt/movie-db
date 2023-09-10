import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { Elysia } from 'elysia';

import { migrationClient } from './database/postgres';
import { HttpError, ValidationError } from './exceptions/http.exception';
import { moviePlugin } from './plugins/movie.plugin';

await migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' });

const app = new Elysia();

app.onError(({ code, error, set }) => {
  if (error instanceof ValidationError) {
    set.status = error.code;
    return {
      errors: error.errors,
    };
  }

  if (error instanceof HttpError) {
    set.status = error.code;
    return {
      error: error.message,
    };
  }

  switch (code) {
    case 'PARSE':
      set.status = 422;
      break;

    case 'VALIDATION':
      set.status = 400;
      break;

    case 'NOT_FOUND':
      set.status = 404;
      break;

    case 'INTERNAL_SERVER_ERROR':
    case 'UNKNOWN':
      set.status = 500;
      break;
  }

  return {
    error: error.message,
  };
});

app.use(moviePlugin);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
