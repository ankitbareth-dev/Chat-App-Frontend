export interface LoginData {
  phone: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
  createdAt: string;
}

export interface AuthApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
