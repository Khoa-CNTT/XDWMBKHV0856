import useVideoDuration from "../../hooks/useVideoDuration";
import { useEffect, useRef } from "react";

function LectureItem({ fileUrl, onDurationLoaded }) {
  const [duration, videoRef] = useVideoDuration(fileUrl);

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // Use ref to track if we've already called onDurationLoaded
  const hasReportedDuration = useRef(false);

  // Send duration back to parent component only once when it becomes available
  useEffect(() => {
    if (duration > 0 && onDurationLoaded && !hasReportedDuration.current) {
      hasReportedDuration.current = true;
      onDurationLoaded(duration);
    }
  }, [duration, onDurationLoaded]);

  return (
    <div>
      <p>{formatTime(duration)}</p>
      <video
        ref={videoRef}
        src={fileUrl}
        style={{ display: "none" }}
        preload="metadata"
      />
    </div>
  );
}

export default LectureItem;
