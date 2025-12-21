import { createContext, useContext } from "react";
import { useAuthStore } from "../store/useAuthStore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuthStore();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
