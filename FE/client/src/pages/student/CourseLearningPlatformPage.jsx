import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import {
  FiBook,
  FiCheck,
  FiDownload,
  FiPlay,
  FiBookmark,
  FiMessageSquare,
} from "react-icons/fi";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { getCourse } from "../../services/course.services";
import { getLecture } from "../../services/lecture.services";

const CourseLearningPlatformPage = () => {
  const { courseId, lectureId } = useParams();
  const [course, setCourse] = useState(null);
  const [lecture, setLecture] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await getCourse(courseId);
      setCourse(response);
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchLecture = async () => {
      const response = await getLecture(lectureId);
      setLecture(response);
    };

    fetchLecture();
  }, [lectureId]);

  const currentLesson = {
    title: "Component Lifecycle",
    description:
      "Learn about React component lifecycle methods and their practical applications in building robust applications.",
    videoUrl: "https://www.youtube.com/watch?v=example",
    resources: [
      { name: "Lecture Slides", size: "2.5MB" },
      { name: "Exercise Files", size: "1.8MB" },
    ],
    transcript:
      "In this lesson, we'll explore the various lifecycle methods in React components...",
  };

  return (
    <div className="flex h-screen bg-background mt-20">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-card border-r border-border h-full overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-heading font-heading">Course Content</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-accent hover:text-primary transition-colors"
                >
                  <BsChevronLeft size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {course?.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="border border-border rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">
                        {chapter.title}
                      </h3>
                      {/* <span className="text-sm text-accent">
                        {module.progress}%
                      </span> */}
                    </div>
                    {/* <div className="h-1 bg-muted rounded-full mb-3">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div> */}
                    <div className="space-y-2">
                      {chapter.lectures.map((lecture) => (
                        <Link
                          to={`/student/course/${courseId}/${lecture.id}`}
                          key={lecture.id}
                          className={`w-full flex items-center justify-between p-2 rounded ${
                            lecture.id.toString() === lectureId
                              ? "bg-primary text-white"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center">
                            {false ? (
                              <FiCheck className="mr-2" />
                            ) : (
                              <FiPlay className="mr-2" size={14} />
                            )}
                            <span>{lecture.title}</span>
                          </div>
                          {/* <span className="text-sm">10:10</span> */}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden">
        {!isSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 text-accent hover:text-primary transition-colors"
          >
            <BsChevronRight size={20} />
          </button>
        )}

        <div className="h-full flex flex-col">
          <div className="aspect-video bg-black">
            <ReactPlayer
              ref={playerRef}
              url={`${import.meta.env.VITE_LECTURE_URL}/${lectureId}/${
                lecture?.file
              }`}
              width="100%"
              height="100%"
              playing={isPlaying}
              controls
              onProgress={(progress) => {
                setProgress(Math.round(progress.played * 100));
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-heading">{currentLesson.title}</h1>
                <div className="flex space-x-4">
                  <button className="flex items-center text-accent hover:text-primary transition-colors">
                    <FiBookmark className="mr-2" />
                    Bookmark
                  </button>
                  <button className="flex items-center text-accent hover:text-primary transition-colors">
                    <FiMessageSquare className="mr-2" />
                    Discussion
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-card rounded-lg p-4">
                    <h2 className="font-heading mb-3">Description</h2>
                    <p className="text-accent">{currentLesson.description}</p>
                  </div>

                  <div className="bg-card rounded-lg p-4">
                    <h2 className="font-heading mb-3">Transcript</h2>
                    <p className="text-accent">{currentLesson.transcript}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-4">
                    <h2 className="font-heading mb-3">Resources</h2>
                    <div className="space-y-2">
                      {currentLesson.resources.map((resource, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center justify-between p-2 rounded hover:bg-muted"
                        >
                          <div className="flex items-center">
                            <FiBook className="mr-2" />
                            <span>{resource.name}</span>
                          </div>
                          <div className="flex items-center text-sm text-accent">
                            <span className="mr-2">{resource.size}</span>
                            <FiDownload />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4">
                    <h2 className="font-heading mb-3">Your Progress</h2>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-accent">Current Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPlatformPage;
