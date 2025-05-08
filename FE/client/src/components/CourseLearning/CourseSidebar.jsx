import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCheck, FaLock, FaPlayCircle, FaGraduationCap } from "react-icons/fa";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import LectureItem from "./LectureItem";

export default function CourseSidebar({ course, currentLectureId }) {
  const { courseId } = useParams();
  const [expandedChapters, setExpandedChapters] = useState([]);

  // Set initial expanded chapters
  useState(() => {
    if (course && currentLectureId) {
      // Find the chapter containing current lecture
      const currentChapterIndex = course.chapters.findIndex((chapter) =>
        chapter.lectures.some((lecture) => lecture.id === currentLectureId)
      );

      if (currentChapterIndex !== -1) {
        setExpandedChapters([
          `chapter-${course.chapters[currentChapterIndex].id}`,
        ]);
      }
    }
  }, [course, currentLectureId]);

  if (!course) {
    return <div className="p-4">Loading course content...</div>;
  }

  // Calculate total lectures and completed lectures
  const totalLectures = course.chapters.reduce(
    (total, chapter) => total + chapter.lectures.length,
    0
  );

  const completedLectures = course.chapters.reduce(
    (total, chapter) =>
      total +
      chapter.lectures.filter((lecture) => lecture.lectureProcess?.done).length,
    0
  );

  const progress =
    totalLectures > 0
      ? Math.round((completedLectures / totalLectures) * 100)
      : 0;

  return (
    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span>Progress: {progress}% completed</span>
          <span>
            {completedLectures}/{totalLectures} lectures
          </span>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </div>

      <Accordion
        type="multiple"
        value={expandedChapters}
        onValueChange={setExpandedChapters}
      >
        {course.chapters.map((chapter) => (
          <AccordionItem
            key={chapter.id}
            value={`chapter-${chapter.id}`}
            className="border rounded-md mb-2"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex flex-1 items-center gap-2">
                <FaGraduationCap className="text-primary" />
                <div className="text-left font-medium">{chapter.title}</div>
                <div className="text-xs text-muted-foreground ml-auto">
                  {chapter.lectures.filter((l) => l.lectureProcess?.done)
                    .length || 0}
                  /{chapter.lectures.length}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0">
              <ul className="divide-y">
                {chapter.lectures.map((lecture) => (
                  <li
                    key={lecture.id}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-muted/50 ${
                      lecture.id === currentLectureId ? "bg-blue-50" : ""
                    }`}
                  >
                    <Link
                      to={`/student/learning/${courseId}/${lecture.id}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {lecture.lectureProcess?.done ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaPlayCircle className="text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`font-medium ${
                            lecture.id === currentLectureId
                              ? "text-blue-600"
                              : ""
                          }`}
                        >
                          {lecture.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <LectureItem
                            fileUrl={
                              lecture.file
                                ? `${import.meta.env.VITE_LECTURE_URL}/${
                                    lecture.id
                                  }/${lecture.file}`
                                : ""
                            }
                          />
                        </div>
                      </div>
                    </Link>
                    {lecture.preview && (
                      <Badge className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                        Preview
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
