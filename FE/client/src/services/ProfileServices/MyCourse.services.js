import http from "../../config/http";

export const getMyCourse = async (id) => {
  try {
    const response = await http.get(`/courses?filter=owner.id:'${id}'`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching my courses:", error);
    throw (
      error.response?.data || {
        message: "An error occurred while fetching courses.",
      }
    );
  }
};
