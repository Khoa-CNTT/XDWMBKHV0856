import http from "../../config/http";

export const changePassword = async (id, newPassword) => {
  try {
    const response = await http.patch("/user.password", {
      id: id,
      password: newPassword,
    });

    return response.data;
  } catch (error) {
    console.error("Change password error:", error);
    throw error;
  }
};
