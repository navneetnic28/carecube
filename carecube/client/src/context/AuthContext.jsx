import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext(null);

const ROLE_HOME = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  centre_owner: "/centre/dashboard",
  admin: "/admin/dashboard",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("carecube_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const { token, user: loggedInUser } = response.data;

    localStorage.setItem("carecube_token", token);
    localStorage.setItem("carecube_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    navigate(ROLE_HOME[loggedInUser.role] || "/");
    return loggedInUser;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    const { token, user: newUser } = response.data;

    localStorage.setItem("carecube_token", token);
    localStorage.setItem("carecube_user", JSON.stringify(newUser));
    setUser(newUser);

    navigate(ROLE_HOME[newUser.role] || "/");
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("carecube_token");
    localStorage.removeItem("carecube_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
