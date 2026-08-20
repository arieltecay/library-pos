import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService, type AuthService } from "./authService";
import type { User } from "@/pages/POS/components/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginPin: (_pin: string) => Promise<void>;
  loginEmail: (_email: string, _password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  authService?: AuthService;
}

function loadInitialUser(service: AuthService): User | null {
  return service.getStoredUser();
}

export function AuthProvider({ children, authService: injectedService = authService }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = loadInitialUser(injectedService);
    if (storedUser) setUser(storedUser);
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