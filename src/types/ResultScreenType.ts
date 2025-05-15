import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export interface Genre {
  label: string;
}

export interface RootStackParamList {
  [key: string]: object | undefined; 

  SearchScreen: undefined;

  ResultScreen: {
    searchText?: string;
    genre?: string;
    year?: string | number;
    rating?: string;
  };

  MovieDetails: {
    movie: any; 
  };
}

export type DropdownType = 'year' | 'rating' | null;


export type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchScreen'>;
export type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResultScreen'>;
export type MovieDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;

export type ResultScreenRouteProp = RouteProp<RootStackParamList, 'ResultScreen'>;
export type MovieDetailsRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;
