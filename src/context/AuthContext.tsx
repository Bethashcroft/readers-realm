import { createContext, useContext, useState, useEffect } from "react";
import type { AuthResponse } from "../api/auth";
import { loginUser, registerUser } from "../api/auth";

interface AuthContextType {
  user: AuthResponse | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userName: string,
    email: string,
    displayName: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const register = async (
    userName: string,
    email: string,
    displayName: string,
    password: string,
  ) => {
    const data = await registerUser(userName, email, displayName, password);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
