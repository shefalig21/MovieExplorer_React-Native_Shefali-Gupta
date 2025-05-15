export interface Movie{
    id:number;
    title:string;
    poster:string;
    release_year:number;
    origin:string;
    language:string;
  }
  
  export interface Filters{
    year:string;
    origin:string;
    language:string;
  }
  
  export interface SearchScreenProps{
    navigation:{
      goBack:()=>void;
      navigate:(screen: string, params: { movie: Movie })=>void;
    };
  }
  