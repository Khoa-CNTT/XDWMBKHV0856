import { FiClock } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const OverviewTab = ({
  lecture,
  duration,
  formatTime,
  isCompleted,
  chapter,
}) => {
  return (
    <div className="space-y-4">
      <div>
        {chapter && (
          <div className="text-sm text-muted-foreground mb-1">
            Chapter: {chapter.title}
          </div>
        )}
        <h2 className="text-xl font-bold flex items-center">
          {lecture?.title}
          {isCompleted && (
            <span className="ml-2 text-green-500">
              <FaCheckCircle />
            </span>
          )}
        </h2>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <FiClock className="mr-1" />
          <span>Duration: {formatTime(duration)}</span>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-sm">{lecture?.description}</p>
      </div>
    </div>
  );
};

export default OverviewTab;
