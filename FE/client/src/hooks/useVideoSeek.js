import { useState, useCallback, useEffect, useRef } from "react";

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

  // Store event handler references to ensure we remove the exact same functions
  const handleDragRef = useRef(null);
  const handleDragEndRef = useRef(null);

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

  const handleDragEnd = useCallback(() => {
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

      // Remove event listeners
      document.removeEventListener("mousemove", handleDragRef.current);
      document.removeEventListener("mouseup", handleDragEndRef.current);
    }
  }, [isDragging, currentTime, duration, wasPlaying, playerRef, setIsPlaying]);

  const handleProgressMouseDown = useCallback(
    (e, progressBarRef) => {
      setWasPlaying(isPlaying);

      if (isPlaying) {
        setIsPlaying(false);
      }

      setIsDragging(true);
      handleSeek(e, progressBarRef);

      // Create specific handler functions that close over the progressBarRef
      const dragHandler = (e) => handleDrag(e, progressBarRef);
      const dragEndHandler = () => handleDragEnd();

      // Store references to remove the exact same functions later
      handleDragRef.current = dragHandler;
      handleDragEndRef.current = dragEndHandler;

      // Add event listeners
      document.addEventListener("mousemove", dragHandler);
      document.addEventListener("mouseup", dragEndHandler);
    },
    [isPlaying, handleSeek, handleDrag, handleDragEnd, setIsPlaying]
  );

  useEffect(() => {
    return () => {
      // Clean up event listeners when component unmounts
      if (handleDragRef.current) {
        document.removeEventListener("mousemove", handleDragRef.current);
      }
      if (handleDragEndRef.current) {
        document.removeEventListener("mouseup", handleDragEndRef.current);
      }
    };
  }, []);

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
    if (!isDragging) {
      setShowTimeTooltip(false);
    }
  }, [isDragging]);

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
