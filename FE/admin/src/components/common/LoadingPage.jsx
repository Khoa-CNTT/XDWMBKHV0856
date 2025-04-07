import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

const LoadingPage = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary/10 w-2 h-2 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 z-10">
        <div className="relative">
          <BiLoaderAlt
            className="w-16 h-16 text-primary animate-spin"
            aria-label="Loading spinner"
          />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        </div>

        <div className="flex flex-col items-center space-y-2">
          <p className="text-foreground/80 text-lg font-medium">Đang tải...</p>
          {showTimeout && (
            <p className="text-destructive/80 text-sm animate-fade-in">
              Quá trình tải đang mất nhiều thời gian hơn dự kiến
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
