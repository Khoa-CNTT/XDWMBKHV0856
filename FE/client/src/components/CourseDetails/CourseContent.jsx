import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaPlayCircle } from "react-icons/fa";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import LectureItem from "../CourseLearning/LectureItem";

// Helper function to format duration
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    const m = minutes.toString().padStart(2, "0");
    const s = secs.toString().padStart(2, "0");
    return `${m}:${s}`;
  }
};

export default function CourseContent({ course }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [lectureDurations, setLectureDurations] = useState({});
  const [chapterDurations, setChapterDurations] = useState({});
  const [totalCourseDuration, setTotalCourseDuration] = useState(0);

  // Memoize the callback function to avoid recreating it on every render
  const collectDuration = useCallback((duration, lectureId) => {
    setLectureDurations((prev) => {
      // Skip if we already have this duration
      if (prev[lectureId] && prev[lectureId] > 0) return prev;

      return {
        ...prev,
        [lectureId]: duration,
      };
    });
  }, []);

  // Calculate chapter durations and total course duration
  useEffect(() => {
    if (!course?.chapters || Object.keys(lectureDurations).length === 0) return;

    let totalDuration = 0;
    const newChapterDurations = {};

    course.chapters.forEach((chapter) => {
      const chapterTotal = chapter.lectures.reduce((acc, lecture) => {
        return acc + (lectureDurations[lecture.id] || 0);
      }, 0);

      newChapterDurations[chapter.id] = chapterTotal;
      totalDuration += chapterTotal;
    });

    setChapterDurations(newChapterDurations);
    setTotalCourseDuration(totalDuration);
  }, [course, lectureDurations]);

  // Filter chapters based on search term
  const filteredChapters =
    course?.chapters
      ?.map((chapter) => ({
        ...chapter,
        lectures: chapter.lectures.filter((lecture) =>
          lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((chapter) => chapter.lectures.length > 0) || [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search lectures"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Hidden video elements for duration calculation */}
      <div style={{ display: "none" }}>
        {course?.chapters?.flatMap((chapter) =>
          chapter.lectures.map((lecture) => (
            <LectureItem
              key={`duration-${lecture.id}`}
              fileUrl={`${import.meta.env.VITE_LECTURE_URL}/${lecture.id}/${lecture.file
                }`}
              onDurationLoaded={(duration) =>
                collectDuration(duration, lecture.id)
              }
            />
          ))
        )}
      </div>

      <div className="text-sm text-muted-foreground mb-2">
        Total Course Duration: {formatDuration(totalCourseDuration)}
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AnimatePresence>
          {filteredChapters.map((chapter) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AccordionItem value={`chapter-${chapter.id}`} className="border">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex flex-1 items-center justify-between pr-4">
                    <div className="text-left font-medium">{chapter.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {chapter.lectures.length} lectures •{" "}
                      {formatDuration(chapterDurations[chapter.id] || 0)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  <ul className="divide-y">
                    {chapter.lectures.map((lecture) => (
                      <li
                        key={lecture.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <FaPlayCircle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          <span>{lecture.title}</span>
                          {lecture.preview && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Preview
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(lectureDurations[lecture.id] || 0)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </Accordion>
    </div>
  );
}
