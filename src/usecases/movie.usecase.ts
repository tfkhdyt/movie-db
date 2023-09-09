import { NewMovie } from '../database/postgres/schemas/movie.schema';
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
}
