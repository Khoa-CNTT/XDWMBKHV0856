import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaReply,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import CourseSidebar from "../../components/CourseLearning/CourseSidebar";
import useFetch from "../../hooks/useFetch";
import VideoPlayer from "../../components/LearningPage/VideoPlayer";
import OverviewTab from "../../components/LearningPage/OverviewTab";
import NotesTab from "../../components/LearningPage/NotesTab";
import DiscussionTab from "../../components/LearningPage/DiscussionTab";
import { lectureProcess } from "../../services/lecture.services";
import { useAuth } from "../../contexts/AuthContext";
import { getOrderByUserIdAndCourseId } from "../../services/order.services";

export default function LearningPage() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [course, setCourse] = useState(null);
  const progressMarkedRef = useRef(false);

  const { data: lecture, refetch: refetchLecture } = useFetch(
    `lecture/${lectureId}`
  );

  // Reset progress tracking when lectureId changes
  useEffect(() => {
    progressMarkedRef.current = false;
    setCurrentProgress(0);
  }, [lectureId]);

  // Check if lecture is already completed from lecture data
  useEffect(() => {
    if (lecture?.lectureProcess?.done) {
      progressMarkedRef.current = true;
      setCurrentProgress(100);
    }
  }, [lecture]);

  // Fetch user's order for this course to get course details
  useEffect(() => {
    const getOrder = async () => {
      if (!user?.id) return;
      try {
        const order = await getOrderByUserIdAndCourseId(user.id, courseId);
        if (!order?.course) {
          // If no course found, redirect to learning dashboard
          navigate("/student/learning-dashboard");
          return;
        }
        setCourse(order.course);
      } catch (error) {
        console.error("Failed to get order:", error);
        // On error, also redirect to learning dashboard
        navigate("/student/learning-dashboard");
      }
    };

    getOrder();
  }, [user?.id, courseId, navigate]);

  const formatTime = useCallback((time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const handleSaveNotes = useCallback(() => {
    alert("Đã lưu ghi chú thành công!");
  }, [notes]);

  const markLectureAsCompleted = useCallback(async () => {
    // Only proceed if we haven't already marked it as completed and user is logged in
    if (progressMarkedRef.current || !user?.id || !course) return;

    try {
      // Set flag first to prevent duplicate calls
      progressMarkedRef.current = true;
      setCurrentProgress(100);

      // Call API to mark lecture as completed
      await lectureProcess({
        user_id: user.id,
        lecture_id: parseInt(lectureId),
      });

      // Refresh lecture data to update UI
      await refetchLecture();

      // Update course data to reflect the new completion status
      const updatedOrder = await getOrderByUserIdAndCourseId(user.id, courseId);
      if (updatedOrder?.course) {
        setCourse(updatedOrder.course);
      }
    } catch (error) {
      // Check if this is the "already completed" error - which we can treat as success
      if (error.message === "User have done this lecture") {
        console.log("Lecture was already completed");
        // Keep the progress marked as complete
        return;
      }

      // For other errors, reset the flag to allow retry
      progressMarkedRef.current = false;
      setCurrentProgress(Math.min(currentProgress, 89)); // Set back below 90%
      console.error("Failed to mark lecture as completed:", error);
    }
  }, [lectureId, user?.id, course, courseId, refetchLecture, currentProgress]);

  const handleVideoComplete = useCallback(() => {
    markLectureAsCompleted();
  }, [markLectureAsCompleted]);

  const handleVideoProgress = useCallback(
    (progress) => {
      const currentTime = progress.playedSeconds;
      const percentage = (currentTime / duration) * 100;

      // Don't update progress if already marked as completed
      if (!progressMarkedRef.current) {
        setCurrentProgress(percentage);
      }

      // Mark lecture as completed when user watches 90% of the video
      if (percentage >= 90 && !progressMarkedRef.current) {
        markLectureAsCompleted();
      }
    },
    [duration, markLectureAsCompleted]
  );

  const handleDuration = useCallback((duration) => {
    setDuration(duration);
  }, []);

  // Find the current chapter containing this lecture
  const currentChapter = course?.chapters?.find((chapter) =>
    chapter.lectures.some((lec) => lec.id === parseInt(lectureId))
  );

  const videoUrl = lecture
    ? `${import.meta.env.VITE_LECTURE_URL}/${lectureId}/${lecture.file}`
    : "";

  // Find current lecture index and get next/previous lecture
  const getNavigationLectures = useCallback(() => {
    if (!course?.chapters) return { prevLecture: null, nextLecture: null };

    let currentLectureIndex = -1;
    let allLectures = [];

    // Flatten all lectures into a single array while preserving order
    course.chapters.forEach((chapter) => {
      allLectures = [...allLectures, ...chapter.lectures];
    });

    // Find current lecture index in the flattened array
    currentLectureIndex = allLectures.findIndex(
      (lec) => lec.id === parseInt(lectureId)
    );

    if (currentLectureIndex === -1)
      return { prevLecture: null, nextLecture: null };

    // Get previous and next lectures based on array order
    const prevLecture =
      currentLectureIndex > 0 ? allLectures[currentLectureIndex - 1] : null;
    const nextLecture =
      currentLectureIndex < allLectures.length - 1
        ? allLectures[currentLectureIndex + 1]
        : null;

    return { prevLecture, nextLecture };
  }, [course, lectureId]);

  const { prevLecture, nextLecture } = getNavigationLectures();

  const handleNavigateToLecture = (lecture) => {
    if (lecture) {
      navigate(`/student/learning/${courseId}/${lecture.id}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-7xl mx-auto">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <h1 className="text-lg font-bold">{course?.title}</h1>
            <div className="text-sm text-muted-foreground">
              {currentChapter?.title && (
                <span className="mr-2">{currentChapter.title}:</span>
              )}
              {lecture?.title}
              {lecture?.lectureProcess && (
                <span className="ml-2 text-green-500">
                  <FaCheckCircle className="inline" />
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/student/learning-dashboard")}
          className="flex items-center gap-2"
        >
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </Button>
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

            <CourseSidebar
              course={course}
              currentLectureId={parseInt(lectureId)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <VideoPlayer
            videoUrl={videoUrl}
            lecture={lecture}
            onComplete={handleVideoComplete}
            onDuration={handleDuration}
            onProgress={handleVideoProgress}
          />

          <div className="p-4">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <OverviewTab
                  lecture={lecture}
                  duration={duration}
                  formatTime={formatTime}
                  isCompleted={
                    lecture?.lectureProcess?.done || progressMarkedRef.current
                  }
                  chapter={currentChapter}
                />
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleNavigateToLecture(prevLecture)}
                    disabled={!prevLecture}
                    className="flex items-center gap-2"
                  >
                    <FaArrowLeft />
                    <span>Previous Lecture</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleNavigateToLecture(nextLecture)}
                    disabled={!nextLecture}
                    className="flex items-center gap-2"
                  >
                    <span>Next Lecture</span>
                    <FaArrowRight />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <NotesTab
                  notes={notes}
                  setNotes={setNotes}
                  onSaveNotes={handleSaveNotes}
                />
              </TabsContent>

              <TabsContent value="discussion" className="space-y-4">
                <DiscussionTab />
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
