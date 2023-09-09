import { DB } from '../../database/postgres';
import { movies, NewMovie } from '../../database/postgres/schemas/movie.schema';
import { HttpError } from '../../exceptions/http.exception';

export default class MovieRepoPostgres {
  constructor(private readonly db: DB) {}

  async insertMovie(movie: NewMovie) {
    try {
      const createdMovie = await this.db
        .insert(movies)
        .values(movie)
        .returning();
      if (createdMovie.length === 0) {
        throw new HttpError('Failed to insert new movie');
      }

      return createdMovie[0];
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError('Failed to insert new movie');
    }
  }

  findAllMovies() {
    try {
      return this.db.select().from(movies);
    } catch (error) {
      throw new HttpError('Failed to find all movies');
    }
  }
}
