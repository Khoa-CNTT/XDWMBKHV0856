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
import useFetch from "../../hooks/useFetch";
import LectureItem from "./LectureItem";

export default function CourseSidebar() {
  const { courseId } = useParams();
  const [expandedChapters, setExpandedChapters] = useState([
    "chapter-1",
    "chapter-2",
  ]);

  const { data: course } = useFetch(`/course-details/${courseId}`);

  // Tính toán tổng số bài học và số bài đã hoàn thành
  const totalLectures = course?.chapters.reduce(
    (total, chapter) => total + chapter.lectures.length,
    0
  );
  const completedLectures = course?.chapters.reduce(
    (total, chapter) =>
      total + chapter.lectures.filter((lecture) => lecture.completed).length ||
      0,
    0
  );
  const progress = Math.round((completedLectures / totalLectures) * 100);

  return (
    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span>Tiến độ: {progress}% hoàn thành</span>
          <span>
            {completedLectures}/{totalLectures} bài học
          </span>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </div>

      <Accordion
        type="multiple"
        value={expandedChapters}
        onValueChange={setExpandedChapters}
      >
        {course?.chapters.map((chapter) => (
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
                  {chapter.lectures.filter((l) => l.completed).length || 0}/
                  {chapter.lectures.length}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0">
              <ul className="divide-y">
                {chapter.lectures.map((lecture) => (
                  <li
                    key={lecture.id}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-muted/50 ${
                      lecture.current ? "bg-blue-50" : ""
                    }`}
                  >
                    <Link
                      to={`/student/learning/${courseId}/${lecture.id}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {lecture.completed ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaPlayCircle className="text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`font-medium ${
                            lecture.current ? "text-blue-600" : ""
                          }`}
                        >
                          {lecture.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <LectureItem
                            fileUrl={`${import.meta.env.VITE_LECTURE_URL}/${
                              lecture.id
                            }/${lecture?.file}`}
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
