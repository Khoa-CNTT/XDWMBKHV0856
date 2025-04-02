import http from "../../config/http";

export const getCourses = async (data) => {
  try {
    const response = await http.get("/courses", {
      params: data,
    });

    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCourse = async (id) => {
  try {
    const response = await http.get(`/course-details/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
