import { toast } from "react-toastify";
import http from "../../config/http";

export const login = async (data, options = { silent: false }) => {
  try {
    const response = await http.post("/login", data);
    localStorage.setItem("token", response.data.data);

    if (!options.silent) {
      toast.success("Login successfully", {
        autoClose: 1000,
        onClose: () => {
          window.location.href = "/";
        },
      });
    }

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

export const logout = async () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
    localStorage.setItem("user", JSON.stringify(response.data.data));
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
