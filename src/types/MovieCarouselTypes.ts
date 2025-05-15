export interface CarouselMovie{
    id:string;
    title:string;
    poster_url:string;
    genre:string;
    rating:number,
  }
  
  export interface MovieCarouselProps{
    movies: CarouselMovie[];
    testID?: string;
  }
 