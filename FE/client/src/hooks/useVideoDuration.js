import { useEffect, useRef, useState } from "react";

const useVideoDuration = (src) => {
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    const vid = videoRef.current;
    const handleLoaded = () => {
      setDuration(vid.duration);
    };
    vid.addEventListener("loadedmetadata", handleLoaded);
    // nếu đã có metadata rồi, cập nhật ngay
    if (vid.readyState >= 1) {
      handleLoaded();
    }
    return () => vid.removeEventListener("loadedmetadata", handleLoaded);
  }, [src]);

  return [duration, videoRef];
};

export default useVideoDuration;
