import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft, FaReply } from "react-icons/fa";
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

// Import tách components
import VideoPlayer from "../../components/LearningPage/VideoPlayer";
import OverviewTab from "../../components/LearningPage/OverviewTab";
import NotesTab from "../../components/LearningPage/NotesTab";
import DiscussionTab from "../../components/LearningPage/DiscussionTab";

export default function LearningPage() {
  const { courseId, lectureId } = useParams();
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [duration, setDuration] = useState(0);

  const { data: course } = useFetch(`course-details/${courseId}`);
  const { data: lecture } = useFetch(`lecture/${lectureId}`);

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

  const handleVideoComplete = useCallback(() => {
    setIsCompleted(true);
  }, []);

  const handleDuration = useCallback((duration) => {
    setDuration(duration);
  }, []);

  const videoUrl = lecture
    ? `${import.meta.env.VITE_LECTURE_URL}/${lectureId}/${lecture.file}`
    : "";

  return (
    <div className="flex flex-col h-screen bg-background max-w-7xl mx-auto">
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
          {/* Video Player */}
          <VideoPlayer
            videoUrl={videoUrl}
            lecture={lecture}
            onComplete={handleVideoComplete}
            onDuration={handleDuration}
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
                />
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
