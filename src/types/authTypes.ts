export interface LoginForm {
  email: string;
  password: string;
  error: string,
}

export interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    role: string;
    profile_picture_url?: string;
  };
}
export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
