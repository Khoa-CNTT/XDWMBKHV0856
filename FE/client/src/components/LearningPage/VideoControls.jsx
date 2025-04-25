import { FaEllipsisV } from "react-icons/fa";
import { MdOutlineSpeed } from "react-icons/md";
import { Button } from "../../components/ui/button";

const VideoControls = ({ playbackRate, onPlaybackRateChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/20"
      >
        <MdOutlineSpeed className="mr-2" />
        {playbackRate}x
      </Button>
      <div className="relative group">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
        >
          <FaEllipsisV />
        </Button>
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
          <div className="p-2">
            <div className="text-sm font-medium mb-2">Speed Control</div>
            <div className="grid grid-cols-3 gap-1">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <Button
                  key={rate}
                  variant={playbackRate === rate ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPlaybackRateChange(rate)}
                  className="text-xs"
                >
                  {rate}x
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
