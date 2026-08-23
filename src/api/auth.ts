import api from "./client";

export interface AuthUser {
  id: string;
  name: string;
  role: "superadmin" | "admin" | "seller";
  schoolId: string;
  posId?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export async function loginWithPin(pin: string, schoolId: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login-pin", { pin, schoolId });
  return data;
}

export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login-email", { email, password });
  return data;
}

export async function getMe(token?: string): Promise<AuthUser & { email: string }> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const { data } = await api.get("/auth/me", config);
  return data;
}

export async function refreshToken(token: string): Promise<{ accessToken: string }> {
  const { data } = await api.post<{ accessToken: string }>("/auth/refresh", { refreshToken: token });
  return data;
}