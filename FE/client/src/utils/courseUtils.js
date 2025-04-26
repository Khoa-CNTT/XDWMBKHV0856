import dayjs from "dayjs";

/**
 * Kiểm tra xem một khoá học có phải là khoá học mới hay không
 * @param {string} createdAt - Ngày tạo khoá học (định dạng: "YYYY-MM-DD HH:MM:SS")
 * @param {number} newDaysThreshold - Số ngày để xác định khoá học mới (mặc định: 7 ngày)
 * @returns {boolean} - true nếu là khoá học mới, false nếu không phải
 */
export const isNewCourse = (createdAt, newDaysThreshold = 7) => {
  const createdDate = dayjs(createdAt?.split(" ")[0]); // VD: 2025-04-16
  const today = dayjs(); // ngày hiện tại
  const diffInDays = today.diff(createdDate, "day"); // số ngày chênh lệch
  return diffInDays <= newDaysThreshold; // nếu số ngày chênh lệch <= threshold thì là khóa học mới
};
