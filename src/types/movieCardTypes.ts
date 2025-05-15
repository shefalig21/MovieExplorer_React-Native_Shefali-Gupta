export interface MovieCardData{
    id:number;
    title:string;
    poster_url:string;
    year:string;
    genre:string,
    rating:number,
    release_year:number,
    duration:string,
  }

  export interface MovieCardProps{
    movie:MovieCardData;
    onPress:()=>void;
  }
  