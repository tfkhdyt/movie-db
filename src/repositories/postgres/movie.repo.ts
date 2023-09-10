import { eq } from 'drizzle-orm';

import { DB } from '../../database/postgres';
import {
  movies,
  NewMovie,
  UpdateMovie,
} from '../../database/postgres/schemas/movie.schema';
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
      return this.db.select().from(movies).orderBy(movies.id);
    } catch (error) {
      throw new HttpError('Failed to find all movies');
    }
  }

  async findMovieByID(id: number) {
    try {
      const movieData = await this.db
        .select()
        .from(movies)
        .where(eq(movies.id, id))
        .limit(1);
      if (movieData.length === 0) {
        throw new HttpError(`Movie with id ${id} is not found`, 404);
      }

      return movieData[0];
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError('Failed to find movie by id');
    }
  }

  async updateMovie(id: number, data: UpdateMovie) {
    try {
      const updatedMovie = await this.db
        .update(movies)
        .set(data)
        .where(eq(movies.id, id))
        .returning();
      if (updatedMovie.length === 0) {
        throw new HttpError(`Failed to update movie with id ${id}`);
      }

      return updatedMovie[0];
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError('Failed to update movie');
    }
  }
}
