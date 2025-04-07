import { create } from "zustand";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../services/auth.services";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoadingLogin: false,
  isLoadingRegister: false,
  isLoadingLogout: false,
  isLoadingCurrentUser: false,

  // Action to log in
  handleLogin: async (data) => {
    set({ isLoadingLogin: true });
    try {
      await login(data);
      const user = await getCurrentUser();
      set({ user });
    } catch (error) {
      set({ isLoadingLogin: false, user: null });
      throw error;
    }
  },

  // Action to register
  handleRegister: async (data) => {
    set({ isLoadingRegister: true });
    try {
      await register(data);
    } catch (error) {
      set({ isLoadingRegister: false });
      throw error;
    }
  },

  // Action to log out
  handleLogout: async () => {
    set({ isLoadingLogout: true });
    try {
      await logout();
      set({ user: null });
    } catch (error) {
      set({ isLoadingLogout: false });
      throw error;
    }
  },

  // Action to fetch the current user
  fetchCurrentUser: async () => {
    set({ isLoadingCurrentUser: true });
    try {
      const user = await getCurrentUser();
      set({ user, isLoadingCurrentUser: false });
    } catch (error) {
      set({ user: null, isLoadingCurrentUser: false });
      throw error;
    }
  },
}));
