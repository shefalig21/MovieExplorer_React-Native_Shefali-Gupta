export interface Movie {
  id: number;
  title: string;
  description?: string;
  genre: string;
  release_year: string | number;
  rating?: string;
  director?: string;
  duration?: string;
  is_premium: boolean;
  poster_url: string;
  banner_url?: string;
}

export interface EditMovieModalProps {
  visible: boolean;
  onClose: () => void;
  movie: Movie;
}

export interface ImageAsset {
  uri: string;
  name?: string;
  type?: string;
}
