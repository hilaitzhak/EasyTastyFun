import { jwtDecode } from "jwt-decode";
import { createContext, useState, ReactNode } from "react";
import { AuthContextProps } from "../interfaces/Auth";

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [user, setUser] = useState<any>(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return token ? jwtDecode(token) : null;
  });

  const login = (newToken: string, userName?: string) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
    
    const decodedToken: any = jwtDecode(newToken);
    const updatedUser = {
      ...decodedToken,
      name: userName || 'User'
    };
    
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};