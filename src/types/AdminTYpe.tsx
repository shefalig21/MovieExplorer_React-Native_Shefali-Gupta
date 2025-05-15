export type Movie={
  id: number;
  title: string;
  release_year: string;
  poster_url: string;
};

export type Meta={
  total_pages: number;
};

export type MovieAPIResponse={
  movies: Movie[];
  meta: Meta;
};
