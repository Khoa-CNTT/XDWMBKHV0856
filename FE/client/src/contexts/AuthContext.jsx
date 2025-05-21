import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login, logout } from "../services/auth.services";
import {
  updateAvatar,
  updateUser,
  uploadBackground,
} from "../services/user.services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const response = await getCurrentUser();
        setUser(response);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (userData) => {
    await login(userData);
    const response = await getCurrentUser();
    setUser(response);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleUpdateUser = async (data) => {
    try {
      await updateUser(data, user.id);
      const response = await getCurrentUser();
      setUser(response);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleUpdateAvatar = async (file) => {
    try {
      await updateAvatar(file, user.id);
      const response = await getCurrentUser();
      setUser(response);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleUpdateBackground = async (file) => {
    try {
      await uploadBackground(file, user.id);
      const response = await getCurrentUser();
      setUser(response);
    } catch (error) {
      console.error("Error updating background:", error);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        handleUpdateUser,
        handleUpdateAvatar,
        handleUpdateBackground,
        refreshUser,
        loadingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
