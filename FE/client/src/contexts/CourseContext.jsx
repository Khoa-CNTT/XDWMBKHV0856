import { createContext, useContext, useState, useCallback } from "react";
import { getCourses, getCoursesByParams } from "../services/course.services";

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 6,
  });

  const fetchCourses = useCallback(async (page = 1, size = 6) => {
    try {
      setIsLoadingCourses(true);
      const response = await getCourses(page, size);
      const { result, meta } = response.data;
      setCourses(result);
      setPagination({
        currentPage: (meta?.page ?? 0) + 1,
        totalPages: meta?.totalPage ?? 1,
        totalItems: meta?.totalElement ?? 0,
        pageSize: meta?.size ?? size,
      });
    } catch {
      setCourses([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: size,
      });
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  const fetchCoursesByParams = useCallback(
    async (params = {}, page = 1, size = 6) => {
      try {
        setIsLoadingCourses(true);
        const response = await getCoursesByParams(params, page, size);
        const { result, meta } = response.data;
        setCourses(result);
        setPagination({
          currentPage: (meta?.page ?? 0) + 1,
          totalPages: meta?.totalPage ?? 1,
          totalItems: meta?.totalElement ?? 0,
          pageSize: meta?.size ?? size,
        });
      } catch {
        setCourses([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          pageSize: size,
        });
      } finally {
        setIsLoadingCourses(false);
      }
    },
    []
  );

  // Debug log for pagination state changes
  console.log("Current Pagination State:", pagination);

  const value = {
    courses,
    isLoadingCourses,
    pagination,
    fetchCourses,
    fetchCoursesByParams,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};
