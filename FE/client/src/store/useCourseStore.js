import { create } from "zustand";
import { getCourses } from "../services/course.services";

export const useCourseStore = create((set) => ({
  courses: [],
  isLoadingCourses: false,

  // Action to fetch courses
  fetchCourses: async (params) => {
    set({ isLoadingCourses: true });
    try {
      const response = await getCourses(params);
      set({ courses: response.result, isLoadingCourses: false });
    } catch (error) {
      set({ isLoadingCourses: false });
      throw error;
    }
  },
}));
