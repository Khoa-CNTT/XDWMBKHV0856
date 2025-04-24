import { useState, useCallback } from "react";

const useVideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [wasPlaying, setWasPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    setIsPlaying((prevState) => !prevState);
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = Number.parseInt(e.target.value) / 100;
    setVolume(newVolume);
  }, []);

  const handlePlaybackRateChange = useCallback((rate) => {
    setPlaybackRate(rate);
  }, []);

  const handleProgress = useCallback(
    (state, onProgressCallback) => {
      if (isPlaying) {
        setCurrentTime(state.playedSeconds);
      }
      if (onProgressCallback) {
        onProgressCallback(state);
      }
    },
    [isPlaying]
  );

  const handleDuration = useCallback((duration, onDurationCallback) => {
    setDuration(duration);
    if (onDurationCallback) {
      onDurationCallback(duration);
    }
  }, []);

  const handleEnded = useCallback((onCompleteCallback) => {
    setIsPlaying(false);
    if (onCompleteCallback) {
      onCompleteCallback();
    }
  }, []);

  const formatTime = useCallback((time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  return {
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    wasPlaying,
    setWasPlaying,
    togglePlay,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleProgress,
    handleDuration,
    handleEnded,
    formatTime,
  };
};

export default useVideoPlayer;
