import useVideoDuration from "../../hooks/useVideoDuration";

function LectureItem({ fileUrl }) {
  const [duration, videoRef] = useVideoDuration(fileUrl);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

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
