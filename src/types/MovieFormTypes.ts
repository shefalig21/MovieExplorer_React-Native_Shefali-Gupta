export interface MovieFormData {
  title: string;
  genre: string;
  release_year: string;
  rating: string;
  director: string;
  duration: string;
  streaming_platform: string;
  main_lead: string;
  description: string;
  premium: boolean;
}

export interface AddMovieModalProps {
  visible: boolean;
  onClose: () => void;
  testID?: string;
}
