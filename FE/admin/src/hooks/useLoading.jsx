import { useCallback, useState } from "react";

export default function useLoading() {
  const [loadingCount, setLoadingCount] = useState(0);

  // Bật loading (tăng số lượng API đang chạy)
  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  // Tắt loading (giảm số lượng API đang chạy)
  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(prev - 1, 0)); // Không để < 0
  }, []);

  return {
    loading: loadingCount > 0, // Chỉ loading khi có ít nhất 1 API đang chạy
    startLoading,
    stopLoading,
  };
}
