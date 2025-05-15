export interface Movie{
  id: number;
  title: string;
  poster_url: string;
  rating: number;
  genre: string;
  release_year: number;
  duration: number;
  description: string;
}

export interface WatchlistResponse{
  movies: Movie[];
}

export interface MoviesListProps{
  movies: Movie[];
  onMoviePress: (movie: Movie) => void;
  skipInitialLoader?: boolean;
}