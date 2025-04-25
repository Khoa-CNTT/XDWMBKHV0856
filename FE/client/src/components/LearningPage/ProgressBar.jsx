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
  return (
    <div className="space-y-2">
      <div
        ref={progressBarRef}
        className="relative h-2 bg-white/30 rounded-full cursor-pointer group"
        onClick={handleSeek}
        onMouseDown={handleProgressMouseDown}
        onMouseMove={handleProgressMouseMove}
        onMouseLeave={!isDragging ? handleProgressMouseLeave : undefined}
      >
        <div
          className="absolute top-0 left-0 h-full bg-primary rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        <div
          className={`absolute h-4 w-4 top-1/2 -translate-y-1/2 bg-white rounded-full cursor-grab ${
            isDragging ? "cursor-grabbing scale-110" : ""
          } ${
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          } transition-all shadow-md`}
          style={{
            left: `${(currentTime / duration) * 100}%`,
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
          <div className="flex items-center">
            <FaVolumeUp className="text-white mr-2" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={onVolumeChange}
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
