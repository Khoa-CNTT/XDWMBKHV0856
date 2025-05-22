import { toast } from "react-toastify";
import http from "../config/http";

export const login = async (data, options = { silent: false }) => {
  try {
    const response = await http.post("/login", data);
    localStorage.setItem("token", response.data.data);

    return response.data.data;
  } catch (error) {
    if (!options.silent) {
      toast.error("Login failed", { autoClose: 1000 });
    }
    throw error.response?.data || error;
  }
};

export const register = async (data) => {
  try {
    await http.post("/user", data);
  } catch (error) {
    throw error.response.data;
  }
};

export const registerInstructor = async (data) => {
  try {
    const response = await http.post("/instructor-register", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem("token");
    toast.success("Logout successfully", {
      autoClose: 1000,
    });
  } catch (error) {
    toast.error("Logout failed", {
      autoClose: 1000,
    });
    throw error.response.data;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await http.get("/account");
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const googleLogin = async () => {
  try {
    const response = await http.get("/login/google", {
      credentials: "include",
    });
    console.log(response.data);
    if (response.data.data) {
      localStorage.setItem("token", response.data.data);
    }
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to login with Google",
    };
  }
};
