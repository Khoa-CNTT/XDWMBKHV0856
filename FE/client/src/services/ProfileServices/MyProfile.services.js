import http from "../../config/http";
import { toast } from "react-toastify";

export const getUser = async (id) => {
  try {
    const response = await http.get(`/user/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return null;
  }
};

export const updateUser = async (data, id) => {
  try {
    const response = await http.put("/user", {
      ...data,
      id,
    });
    toast.success("Update successfully", {
      autoClose: 1000,
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateAvatar = async (file, id) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await http.patch(`/user.avatar/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Update successfully", {
      autoClose: 1000,
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const uploadBackground = async (file, id) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await http.patch(`/user.background/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Update successfully", {
      autoClose: 1000,
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
