import http from "../../config/http";
import { toast } from "react-toastify";

export const updateUser = async (data) => {
  try {
    await http.put("/user", data);
    toast.success("Update successfully", {
      autoClose: 1000,
    });
  } catch (error) {
    console.error("Error response:", error.response);
    throw error.response?.data || error;
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
    localStorage.setItem("user", JSON.stringify(response.data.data));
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
    localStorage.setItem("user", JSON.stringify(response.data.data));
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await http.get("/users");
    return response.data.data.result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};

export const checkEmailExist = async (email) => {
  try {
    const users = await getAllUsers();
    if (!Array.isArray(users)) {
      console.error("Invalid data format: users is not an array");
      return { userExists: false, userId: null };
    }
    const user = users.find(user => user.email === email);
    if (user) {
      return { userExists: true, userId: user.id };
    } else {
      return { userExists: false, userId: null };
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return { userExists: false, userId: null };
  }
};