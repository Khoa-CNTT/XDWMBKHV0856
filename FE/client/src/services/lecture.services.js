import http from "../../config/http";

export const getLecture = async (id) => {
  try {
    const response = await http.get(`/lecture/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
