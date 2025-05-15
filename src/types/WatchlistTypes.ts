export interface Movie {
  id: number;
  title: string;
  poster_url: string;
  release_year: string;
  genre: string;
  rating: number;
}

export interface WatchlistResponse {
  movies: Movie[];
}
