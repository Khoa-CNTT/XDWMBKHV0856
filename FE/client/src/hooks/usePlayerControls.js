import { useState, useCallback, useEffect, useRef } from "react";

const usePlayerControls = (isPlaying) => {
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const setupControlsHandlers = useCallback(
    (videoContainer) => {
      if (!videoContainer) return () => {};

      const handleMouseLeave = () => {
        if (isPlaying) {
          setShowControls(false);
        }
      };

      videoContainer.addEventListener("mousemove", handleMouseMove);
      videoContainer.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        videoContainer.removeEventListener("mousemove", handleMouseMove);
        videoContainer.removeEventListener("mouseleave", handleMouseLeave);
        clearTimeout(controlsTimeoutRef.current);
      };
    },
    [handleMouseMove, isPlaying]
  );

  return { showControls, setupControlsHandlers };
};

export default usePlayerControls;
