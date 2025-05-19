import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { login as apiLogin, getProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/ingreso");
  }, [navigate]);

  const loadUserProfile = useCallback(async () => {
    try {
      const profileData = await getProfile();
      console.log(profileData.data);
      const formattedUser = {
        name: profileData.data?.name,
        email: profileData.data?.email,
        role: profileData.data?.role,
        status: profileData.data?.status,
        subscription: {
          name: profileData.data?.subscription?.name,
          duration: profileData.data?.subscription?.duration,
          start: profileData.data?.subscriptionStart,
          end: profileData.data?.subscriptionEnd,
        },
      };

      setUser(formattedUser);
      setError(null);
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Error cargando perfil");
      logout();
    }
  }, [logout]);

  const verifyToken = useCallback(async () => {
    try {
      if (token) {
        await loadUserProfile();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      setError("Sesión expirada");
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, loadUserProfile, logout]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiLogin(credentials);

      if (response.success && response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        setToken(response.data.accessToken);
        await loadUserProfile();
        navigate("/");
        return { success: true };
      }

      throw new Error(response.message || "Error en el login");
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
