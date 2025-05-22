import { NavigationProp } from '@react-navigation/native';

export type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

export type User = {
  username: string;
  email: string;
  role: string;
  avatar: string;
  plan: string;
};


export type Navigation = NavigationProp<Record<string, object | undefined>>;


export type CustomAlertProps = {
  visible: boolean;
  onClose: () => void;
};