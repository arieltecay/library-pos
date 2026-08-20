import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService, type AuthService } from "./authService";
import type { User } from "@/pages/POS/components/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginPin: (pin: string) => Promise<void>;
  loginEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  authService?: AuthService;
}

export function AuthProvider({ children, authService: injectedService = authService }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = injectedService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, [injectedService]);

  async function loginPin(pin: string) {
    const loggedInUser = await injectedService.loginPin(pin);
    setUser(loggedInUser);
  }

  async function loginEmail(email: string, password: string) {
    const loggedInUser = await injectedService.loginEmail(email, password);
    setUser(loggedInUser);
  }

  function logout() {
    injectedService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loginPin,
        loginEmail,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}