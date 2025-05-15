import { Movie } from "./MoviesListTypes";

export interface genreScreenProp{
    navigation:any,
}

export interface Genre{
    title:string,
    movies:Movie[],
    onMoviePress:(movie:Movie)=>void

}