import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface Genre {
  label: string;
}

export interface RootStackParamList {
  [key: string]: object | undefined; 

  ResultScreen: {
    searchText?: string;
    genre?: string;
    year?: string | number;
    rating?: string;
     id: number;
  };

  SearchScreen: undefined;

  MovieDetails: {
    movie: any; 
  };
}

export type DropdownType = 'year' | 'rating' | null;

export type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchScreen'>;

export interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}
