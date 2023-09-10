import {
  NewMovie,
  UpdateMovie,
} from '../database/postgres/schemas/movie.schema';
import MovieRepoPostgres from '../repositories/postgres/movie.repo';

export default class MovieUsecase {
  constructor(private readonly movieRepo: MovieRepoPostgres) {}

  async insertMovie(movie: NewMovie) {
    const createdMovie = await this.movieRepo.insertMovie(movie);

    return {
      message: 'New movie has been inserted successfully',
      data: createdMovie,
    };
  }

  async findAllMovies() {
    const moviesData = await this.movieRepo.findAllMovies();

    return {
      data: moviesData,
    };
  }

  async findMovieByID(id: number) {
    const movieData = await this.movieRepo.findMovieByID(id);

    return {
      data: movieData,
    };
  }

  async updateMovie(id: number, payload: UpdateMovie) {
    await this.findMovieByID(id);
    const updatedMovie = await this.movieRepo.updateMovie(id, payload);

    return {
      message: `Movie with id ${id} has been updated successfully`,
      data: updatedMovie,
    };
  }

  async deleteMovie(id: number) {
    await this.findMovieByID(id);
    await this.movieRepo.deleteMovie(id);

    return {
      message: `Movie with id ${id} has been deleted`,
    };
  }
}
