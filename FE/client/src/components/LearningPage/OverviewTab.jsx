import { FiClock } from "react-icons/fi";

const OverviewTab = ({ lecture, duration, formatTime }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">{lecture?.title}</h2>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <FiClock className="mr-1" />
          <span>{formatTime(duration)}</span>
        </div>
        <p className="text-muted-foreground">
          {lecture?.description ||
            "In this tutorial, we will learn about JSX - a JavaScript extension syntax used in React to describe user interfaces. You will learn how JSX is converted to React.createElement() and how to use JSX effectively in React components."}
        </p>
      </div>
    </div>
  );
};

export default OverviewTab;
