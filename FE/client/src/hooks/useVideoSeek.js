import { useState, useCallback, useEffect } from "react";

const useVideoSeek = (
  playerRef,
  duration,
  currentTime,
  setCurrentTime,
  isPlaying,
  setIsPlaying
) => {
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const [tooltipTime, setTooltipTime] = useState(0);
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);
  const SKIP_TIME = 15;

  const handleSeek = useCallback(
    (e, progressBarRef) => {
      if (!progressBarRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const fraction = Math.min(Math.max(offsetX / rect.width, 0), 1);

      playerRef.current?.seekTo(fraction, "fraction");
      setCurrentTime(fraction * duration);
    },
    [duration, playerRef, setCurrentTime]
  );

  const handleProgressMouseDown = useCallback(
    (e, progressBarRef) => {
      setWasPlaying(isPlaying);

      if (isPlaying) {
        setIsPlaying(false);
      }

      setIsDragging(true);
      handleSeek(e, progressBarRef);

      document.addEventListener("mousemove", (e) =>
        handleDrag(e, progressBarRef)
      );
      document.addEventListener("mouseup", (e) =>
        handleDragEnd(e, progressBarRef)
      );
    },
    [isPlaying, handleSeek, setIsPlaying]
  );

  const handleDrag = useCallback(
    (e, progressBarRef) => {
      if (isDragging && progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();

        let clientX = e.clientX;

        if (clientX < rect.left) clientX = rect.left;
        if (clientX > rect.left + rect.width) clientX = rect.left + rect.width;

        const offsetX = clientX - rect.left;
        const fraction = offsetX / rect.width;

        setTooltipPosition(offsetX);
        setTooltipTime(fraction * duration);
        setCurrentTime(fraction * duration);
        setShowTimeTooltip(true);
      }
    },
    [isDragging, duration, setCurrentTime]
  );

  const handleDragEnd = useCallback(
    (e, progressBarRef) => {
      if (isDragging) {
        if (playerRef.current) {
          playerRef.current.seekTo(currentTime / duration, "fraction");
        }

        setTimeout(() => {
          if (wasPlaying) {
            setIsPlaying(true);
          }
        }, 100);

        setIsDragging(false);
        setShowTimeTooltip(false);

        document.removeEventListener("mousemove", (e) =>
          handleDrag(e, progressBarRef)
        );
        document.removeEventListener("mouseup", (e) =>
          handleDragEnd(e, progressBarRef)
        );
      }
    },
    [isDragging, currentTime, duration, wasPlaying, playerRef, setIsPlaying]
  );

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [handleDrag, handleDragEnd]);

  const handleProgressMouseMove = useCallback(
    (e, progressBarRef) => {
      if (!progressBarRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const fraction = Math.min(Math.max(offsetX / rect.width, 0), 1);

      setTooltipPosition(offsetX);
      setTooltipTime(fraction * duration);
      setShowTimeTooltip(true);
    },
    [duration]
  );

  const handleProgressMouseLeave = useCallback(() => {
    setShowTimeTooltip(false);
  }, []);

  const handleStepBackward = useCallback(() => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();
    const newTime = Math.max(0, currentTime - SKIP_TIME);
    setCurrentTime(newTime);
    playerRef.current.seekTo(newTime, "seconds");
  }, [playerRef, setCurrentTime]);

  const handleStepForward = useCallback(() => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();
    const newTime = Math.min(duration, currentTime + SKIP_TIME);
    setCurrentTime(newTime);
    playerRef.current.seekTo(newTime, "seconds");
  }, [playerRef, duration, setCurrentTime]);

  return {
    tooltipPosition,
    tooltipTime,
    showTimeTooltip,
    isDragging,
    handleSeek,
    handleProgressMouseDown,
    handleProgressMouseMove,
    handleProgressMouseLeave,
    handleStepBackward,
    handleStepForward,
  };
};

export default useVideoSeek;
