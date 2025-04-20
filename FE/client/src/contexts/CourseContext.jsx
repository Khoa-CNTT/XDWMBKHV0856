import { createContext, useContext, useEffect, useState } from "react";
import { getCourses } from "../services/course.services";

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  useEffect(() => {
    const fetchCourses = async (params) => {
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

    fetchCourses();
  }, [setCourses]);

  return (
    <CourseContext.Provider value={{ courses, isLoadingCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => useContext(CourseContext);
