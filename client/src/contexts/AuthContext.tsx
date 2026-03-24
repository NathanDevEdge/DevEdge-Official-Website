import React, { createContext, useContext, useState, useEffect } from "react";

export type User = {
  id: number;
  email: string;
  name: string;
  role: "admin" | "client";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("portal_token");
    if (storedToken) {
      fetch("/api/auth", {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setToken(storedToken);
          setUser(data.user);
        } else {
          localStorage.removeItem("portal_token");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("portal_token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("portal_token");
    setToken(null);
    setUser(null);
    window.location.href = "/portal/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
