import http from "../config/http";

export const getLecture = async (id) => {
  try {
    const response = await http.get(`/lecture/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const lectureProcess = async (data) => {
  try {
    // Create and populate FormData
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Send with multipart/form-data content type
    const response = await http.patch("/lecture.process", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error updating lecture progress:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
