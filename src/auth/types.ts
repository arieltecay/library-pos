export interface User {
  id: string;
  name: string;
  email?: string;
  role: "admin" | "seller";
  schoolId: string;
  posId?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}