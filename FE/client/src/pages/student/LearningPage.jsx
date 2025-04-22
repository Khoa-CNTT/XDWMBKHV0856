import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaDownload,
  FaEllipsisV,
  FaExpand,
  FaFileAlt,
  FaPause,
  FaPlay,
  FaReply,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
} from "react-icons/fa";
import {
  FiBookmark,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";
import { MdOutlineSpeed } from "react-icons/md";

import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import CourseSidebar from "../../components/CourseLearning/CourseSidebar";
import useFetch from "../../hooks/useFetch";
import ReactPlayer from "react-player";

export default function LearningPage() {
  const { courseId, lectureId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const { data: course } = useFetch(`course-details/${courseId}`);
  const { data: lecture } = useFetch(`lecture/${lectureId}`);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      videoContainer.addEventListener("mousemove", handleMouseMove);
      videoContainer.addEventListener("mouseleave", () => {
        if (isPlaying) {
          setShowControls(false);
        }
      });
    }

    return () => {
      if (videoContainer) {
        videoContainer.removeEventListener("mousemove", handleMouseMove);
        videoContainer.removeEventListener("mouseleave", () => {});
      }
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [handleMouseMove, isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
          ? true
          : false
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prevState) => !prevState);
  }, []);

  const handleSeek = useCallback(
    (e) => {
      const seekTime =
        (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
      playerRef.current?.seekTo(seekTime / duration, "fraction");
      setCurrentTime(seekTime);
    },
    [duration]
  );

  const handleVolumeChange = useCallback((e) => {
    const newVolume = Number.parseInt(e.target.value) / 100;
    setVolume(newVolume);
  }, []);

  const handlePlaybackRateChange = useCallback((rate) => {
    setPlaybackRate(rate);
  }, []);

  const handleProgress = useCallback(
    (state) => {
      if (isPlaying) {
        setCurrentTime(state.playedSeconds);
      }
    },
    [isPlaying]
  );

  const handleDuration = useCallback((duration) => {
    setDuration(duration);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setIsCompleted(true);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const videoContainer = videoContainerRef.current;
    if (!videoContainer) return;

    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }, [isFullscreen]);

  const formatTime = useCallback((time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const markAsCompleted = useCallback(() => {
    setIsCompleted(true);
  }, []);

  const handleSaveNotes = useCallback(() => {
    alert("Đã lưu ghi chú thành công!");
  }, [notes]);

  const videoUrl = lecture
    ? `${import.meta.env.VITE_LECTURE_URL}/${lectureId}/${lecture.file}`
    : "";

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <h1 className="text-lg font-bold">{course?.title}</h1>
            <div className="text-sm text-muted-foreground">
              Lecture {lecture?.id}: {lecture?.title}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiBookmark className="mr-2" />
            Bookmark
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`border-l ${
            isSidebarOpen ? "w-80" : "w-0"
          } transition-all duration-300 overflow-hidden`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Course Content</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden"
              >
                <FaArrowLeft />
              </Button>
            </div>

            <CourseSidebar />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div
            ref={videoContainerRef}
            className="relative bg-black aspect-video max-h-[70vh]"
            onDoubleClick={toggleFullscreen}
          >
            {videoUrl && (
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                width="100%"
                height="100%"
                playing={isPlaying}
                volume={volume}
                playbackRate={playbackRate}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onEnded={handleEnded}
                onClick={togglePlay}
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
                  <h2 className="text-white text-lg font-medium">
                    {lecture?.title}
                  </h2>
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
                          <div className="text-sm font-medium mb-2">
                            Speed Control
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <Button
                                key={rate}
                                variant={
                                  playbackRate === rate ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => handlePlaybackRateChange(rate)}
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
                </div>

                {!isPlaying && (
                  <button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-6"
                    onClick={togglePlay}
                  >
                    <FaPlay className="text-white text-3xl" />
                  </button>
                )}

                <div className="space-y-2">
                  <div
                    className="h-1 bg-white/30 rounded cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-primary rounded"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 p-1"
                      >
                        <FaStepBackward />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 p-2"
                        onClick={togglePlay}
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
                          onChange={handleVolumeChange}
                          className="w-20"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 p-1"
                        onClick={toggleFullscreen}
                      >
                        <FaExpand />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
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
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <div className="space-y-4">
                  <textarea
                    className="w-full h-64 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotes}>Save Notes</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="discussion" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>HV</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <textarea
                        className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Đặt câu hỏi hoặc chia sẻ ý kiến của bạn..."
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <Button>Đăng bình luận</Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>NVA</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Nguyễn Văn A</span>
                          <span className="text-sm text-muted-foreground">
                            2 ngày trước
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Giảng viên
                          </span>
                        </div>
                        <p className="my-2">
                          Làm thế nào để tối ưu hiệu suất khi sử dụng JSX với số
                          lượng lớn phần tử?
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <FiMessageSquare />
                            <span>Trả lời</span>
                          </button>
                        </div>

                        <div className="mt-4 ml-8 space-y-4">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>GV</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Giảng viên</span>
                                <span className="text-sm text-muted-foreground">
                                  1 ngày trước
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  Giảng viên
                                </span>
                              </div>
                              <p className="my-2">
                                Bạn có thể sử dụng React.memo, useMemo và
                                useCallback để tránh render không cần thiết.
                                Ngoài ra, việc sử dụng key đúng cách cũng rất
                                quan trọng khi render danh sách.
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                  <FiMessageSquare />
                                  <span>Trả lời</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {!isSidebarOpen && (
          <button
            className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaReply />
          </button>
        )}
      </div>
    </div>
  );
}
