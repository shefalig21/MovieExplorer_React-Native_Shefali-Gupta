import { MovieCardData } from "./movieCardTypes";

export interface Movie{
  id: number;
  title: string;
  poster_url: string;
  [key: string]: any;
}

export interface MoviesApiResponse{
  movies: Movie[];
  meta: {
    total_pages: number;
  };
}

export interface MoviesListProps {
  title: string;
  onMoviePress: (movie: MovieCardData) => void;
  filter?: (movie: MovieCardData) => boolean;

}