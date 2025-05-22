import { useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import ProgressBar from "./ProgressBar";
import { FaPlay } from "react-icons/fa";
import useVideoPlayer from "../../hooks/useVideoPlayer";
import useVideoFullscreen from "../../hooks/useVideoFullscreen";
import useVideoSeek from "../../hooks/useVideoSeek";
import usePlayerControls from "../../hooks/usePlayerControls";

const VideoPlayer = ({
  videoUrl,
  lecture,
  onComplete,
  onDuration,
  onProgress,
}) => {
  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const progressBarRef = useRef(null);

  // Sử dụng các custom hooks
  const {
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    togglePlay,
    handleVolumeChange,
    formatTime,
  } = useVideoPlayer();

  const { toggleFullscreen } = useVideoFullscreen(videoContainerRef);

  const { showControls, setupControlsHandlers } = usePlayerControls(isPlaying);

  const {
    tooltipPosition,
    tooltipTime,
    showTimeTooltip,
    isDragging,
    handleSeek: baseHandleSeek,
    handleProgressMouseDown: baseHandleProgressMouseDown,
    handleProgressMouseMove: baseHandleProgressMouseMove,
    handleProgressMouseLeave,
    handleStepBackward,
    handleStepForward,
  } = useVideoSeek(
    playerRef,
    duration,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying
  );

  // Wrapper functions that provide progressBarRef to the seek hook
  const handleSeek = (e) => baseHandleSeek(e, progressBarRef);
  const handleProgressMouseDown = (e) =>
    baseHandleProgressMouseDown(e, progressBarRef);
  const handleProgressMouseMove = (e) =>
    baseHandleProgressMouseMove(e, progressBarRef);

  // Set up control handlers using useEffect instead of useRef
  useEffect(() => {
    if (videoContainerRef.current) {
      const cleanup = setupControlsHandlers(videoContainerRef.current);
      return cleanup;
    }
  }, [setupControlsHandlers]);

  // Handle player callbacks
  const handleProgress = (state) => {
    if (isPlaying) {
      setCurrentTime(state.playedSeconds);
    }
    if (onProgress) {
      onProgress(state);
    }
  };

  const handleDurationChange = (durationValue) => {
    setDuration(durationValue);
    if (onDuration) {
      onDuration(durationValue);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleFullscreenClick = (e) => {
    e.stopPropagation();
    toggleFullscreen();
  };

  const handleVolumeClick = (e) => {
    e.stopPropagation();
    handleVolumeChange(e);
  };

  const handleStepBackwardClick = (e) => {
    e.stopPropagation();
    handleStepBackward();
  };

  const handleStepForwardClick = (e) => {
    e.stopPropagation();
    handleStepForward();
  };

  return (
    <div
      ref={videoContainerRef}
      className="relative bg-black aspect-video"
      onDoubleClick={toggleFullscreen}
      onClick={togglePlay}
    >
      {videoUrl && (
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          onProgress={handleProgress}
          onDuration={handleDurationChange}
          onEnded={handleEnded}
          progressInterval={500}
          config={{
            file: {
              attributes: {
                preload: "auto",
                controlsList: "nodownload",
              },
              forceVideo: true,
            },
          }}
        />
      )}

      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex flex-col justify-between p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-lg font-medium">{lecture?.title}</h2>
          </div>

          {!isPlaying && (
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-6"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              <FaPlay className="text-white text-3xl" />
            </button>
          )}

          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            isDragging={isDragging}
            tooltipPosition={tooltipPosition}
            tooltipTime={tooltipTime}
            showTimeTooltip={showTimeTooltip}
            progressBarRef={progressBarRef}
            formatTime={formatTime}
            handleSeek={handleSeek}
            handleProgressMouseDown={handleProgressMouseDown}
            handleProgressMouseMove={handleProgressMouseMove}
            handleProgressMouseLeave={handleProgressMouseLeave}
            onStepBackward={handleStepBackwardClick}
            onStepForward={handleStepForwardClick}
            onTogglePlay={togglePlay}
            isPlaying={isPlaying}
            volume={volume}
            onVolumeChange={handleVolumeClick}
            onToggleFullscreen={handleFullscreenClick}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
