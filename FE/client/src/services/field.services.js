import http from "../../config/http";

export const getFields = async (data) => {
  try {
    const response = await http.get("/fields", {
      params: data,
    });

    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
