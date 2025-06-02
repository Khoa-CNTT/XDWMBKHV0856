import http from "../../config/http";
export const sendOtpToEmail = async (email) => {
  try {
    const response = await http.post("/email/verify", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to send OTP";
  }
};
