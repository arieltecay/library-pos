import { loginWithPin, loginWithEmail } from "@/api/auth";
import type { User } from "@/auth/types";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;

export interface AuthService {
  getStoredUser: () => User | null;
  getAccessToken: () => string | null;
  loginPin: (pin: string) => Promise<User>;
  loginEmail: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

export function createAuthService(): AuthService {
  function getStoredUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (stored && token) {
      return JSON.parse(stored);
    }
    return null;
  }

  function getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  async function loginPin(pin: string): Promise<User> {
    const res = await loginWithPin(pin);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
    return res.user;
  }

  async function loginEmail(email: string, password: string): Promise<User> {
    const res = await loginWithEmail(email, password);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
    return res.user;
  }

  function logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  return {
    getStoredUser,
    getAccessToken,
    loginPin,
    loginEmail,
    logout,
  };
}

export const authService = createAuthService();