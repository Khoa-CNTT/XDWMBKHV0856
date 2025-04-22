import { createContext, useContext, useEffect, useState } from "react";
import { getCourses } from "../services/course.services";

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourse(true);
      try {
        const response = await getCourses();
        setCourses(response.result);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoadingCourse(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchCoursesByParams = async (params) => {
    setIsLoadingCourse(true);
    try {
      const response = await getCourses(params);
      setCourses(response.result);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  return (
    <CourseContext.Provider
      value={{ courses, isLoadingCourse, fetchCoursesByParams }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => useContext(CourseContext);
