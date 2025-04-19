import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// map segment thành label (có thể mở rộng theo route của bạn)
const LABEL_MAP = {
  courses: "Courses",
  programming: "Lập trình",
  javascript: "JavaScript",
  // …thêm vào khi cần
};

export default function useBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Home", path: "/" }];

    segments.forEach((seg, idx) => {
      const path = "/" + segments.slice(0, idx + 1).join("/");
      crumbs.push({
        label: LABEL_MAP[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
        path,
      });
    });

    return crumbs;
  }, [location.pathname]);

  return {
    breadcrumbs,
    go: navigate,
  };
}
