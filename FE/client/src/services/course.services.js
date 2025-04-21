import http from "../../config/http";
import { toast } from "react-toastify";

export const getCourses = async (params) => {
  try {
    const response = await http.get("/courses", {
      params,
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

export const getCourseById = async (id) => {
  try {
    const response = await http.get(`/courses?filter=owner.id:${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getNewCourseId = async (id) => {
  try {
    const response = await http.get(`/courses?filter=owner.id:${id}`);
    return response.data.data.result;
  } catch (error) {
    throw error.response.data;
  }
};

export const createCourse = async (data) => {
  try {
    await http.post("/course", data);
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateImageCourse = async (file, courseId) => {
  if (!file) {
    toast.error("No file selected for upload!", { autoClose: 2000 });
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await http.patch(`/course.image/${courseId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const updatedCourse = response?.data?.data || null;
    if (updatedCourse) {
      localStorage.setItem("course", JSON.stringify(updatedCourse));
    }

    return updatedCourse;
  } catch (error) {
    toast.error("Failed to update image, please try again!", {
      autoClose: 2000,
    });
    throw error.response?.data || error;
  }
};

export const createChapter = async (data) => {
  try {
    const response = await http.post("/chapter", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createLecture = async (data) => {
  try {
    const response = await http.post("/lecture", data);
    return response?.data?.data?.id;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateLecture = async (file, lectureId) => {
  if (!file) {
    toast.error("No file selected for upload!", { autoClose: 2000 });
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await http.patch(`/lecture.file/${lectureId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const updatedLecture = response?.data?.data;
    if (updatedLecture) {
      localStorage.setItem("lecture", JSON.stringify(updatedLecture));
    }

    return updatedLecture;
  } catch (error) {
    toast.error("Failed to update lecture file, please try again!", {
      autoClose: 2000,
    });
    throw error.response?.data || error;
  }
};

export const toggleCourseActive = async (courseId) => {
  try {
    const response = await http.patch(`/course.active/${courseId}`);
    const updatedCourse = response?.data?.data;

    if (updatedCourse) {
      const newState = updatedCourse.active ? "ACTIVE" : "INACTIVE";
      console.log(`Course ${courseId} is now: ${newState}`);
    }

    return updatedCourse;
  } catch (error) {
    console.error("Failed to toggle course active status:", error);
    throw error.response?.data || error;
  }
};