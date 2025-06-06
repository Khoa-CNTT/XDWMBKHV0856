import {
  FaStepBackward,
  FaStepForward,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaExpand,
} from "react-icons/fa";
import { Button } from "../../components/ui/button";

const ProgressBar = ({
  currentTime,
  duration,
  isDragging,
  tooltipPosition,
  tooltipTime,
  showTimeTooltip,
  progressBarRef,
  formatTime,
  handleSeek,
  handleProgressMouseDown,
  handleProgressMouseMove,
  handleProgressMouseLeave,
  onStepBackward,
  onStepForward,
  onTogglePlay,
  isPlaying,
  volume,
  onVolumeChange,
  onToggleFullscreen,
}) => {
  // Calculate the progress percentage safely
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-2">
      <div
        ref={progressBarRef}
        className="relative h-2 bg-white/30 rounded-full cursor-pointer group"
        onClick={handleSeek}
        onMouseDown={handleProgressMouseDown}
        onMouseMove={handleProgressMouseMove}
        onMouseLeave={handleProgressMouseLeave}
        onMouseOut={(e) => {
          // Check if the mouse is actually leaving the progress bar
          const rect = progressBarRef.current?.getBoundingClientRect();
          if (rect) {
            const { clientX, clientY } = e;
            if (
              clientX < rect.left ||
              clientX > rect.right ||
              clientY < rect.top ||
              clientY > rect.bottom
            ) {
              handleProgressMouseLeave();
            }
          }
        }}
      >
        <div
          className="absolute top-0 left-0 h-full bg-primary rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
        <div
          className={`absolute h-4 w-4 top-1/2 -translate-y-1/2 bg-white rounded-full ${
            isDragging ? "cursor-grabbing scale-110" : "cursor-grab"
          } ${
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          } transition-all shadow-md`}
          style={{
            left: `${progressPercentage}%`,
            transform: "translateX(-50%) translateY(-50%)",
          }}
        />
        {(showTimeTooltip || isDragging) && (
          <div
            className="absolute bottom-full mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded transform -translate-x-1/2 z-10"
            style={{ left: tooltipPosition }}
          >
            {formatTime(tooltipTime)}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1"
            onClick={onStepBackward}
          >
            <FaStepBackward />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
          >
            {isPlaying ? (
              <FaPause className="text-xl" />
            ) : (
              <FaPlay className="text-xl" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1"
            onClick={onStepForward}
          >
            <FaStepForward />
          </Button>
          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <FaVolumeUp className="text-white mr-2" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => {
                e.stopPropagation();
                onVolumeChange(e);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-20"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1"
            onClick={onToggleFullscreen}
          >
            <FaExpand />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
