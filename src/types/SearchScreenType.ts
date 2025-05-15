import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface Genre {
  label: string;
}

export type DropdownType = 'year' | 'rating' | null;

export type RootStackParamList = {
  SearchScreen: undefined;
  ResultScreen: {
    searchText?: string;
    genre?: string;
    year?: string | number;
    rating?: string;
    id?: number; 
  };
  MovieDetails: {
    movie: any;
  };
};

export type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchScreen'>;

export interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}
