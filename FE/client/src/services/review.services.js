import http from "../../config/http";
import { toast } from "react-toastify";

export const createReview = async (data) => {
  try {
    const response = await http.post("/review", data);
    toast.success("Review successfully", {
      autoClose: 1000,
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getReviews = async (params) => {
  try {
    const response = await http.get("/reviews", { params });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
