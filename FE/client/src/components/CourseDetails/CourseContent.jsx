import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaPlayCircle } from "react-icons/fa";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";

export default function CourseContent() {
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    {
      id: 1,
      title: "Introduction",
      duration: "45 minutes",
      lectures: [
        {
          id: 1,
          title: "Course Introduction",
          duration: "5:20",
          preview: true,
        },
        {
          id: 2,
          title: "Setting Up Development Environment",
          duration: "12:40",
          preview: false,
        },
        {
          id: 3,
          title: "React Overview",
          duration: "15:30",
          preview: true,
        },
        {
          id: 4,
          title: "React Project Structure",
          duration: "10:15",
          preview: false,
        },
      ],
    },
    {
      id: 2,
      title: "React Basics",
      duration: "3 hours 25 minutes",
      lectures: [
        {
          id: 5,
          title: "JSX and How It Works",
          duration: "18:45",
          preview: false,
        },
        {
          id: 6,
          title: "Components and Props",
          duration: "22:10",
          preview: true,
        },
        {
          id: 7,
          title: "State and Lifecycle",
          duration: "25:30",
          preview: false,
        },
        { id: 8, title: "Handling Events", duration: "20:15", preview: false },
        {
          id: 9,
          title: "Conditional Rendering",
          duration: "15:40",
          preview: false,
        },
        { id: 10, title: "Lists and Keys", duration: "19:20", preview: false },
        {
          id: 11,
          title: "Forms in React",
          duration: "23:45",
          preview: false,
        },
        {
          id: 12,
          title: "Mini Project: Todo App",
          duration: "60:00",
          preview: false,
        },
      ],
    },
    {
      id: 3,
      title: "React Hooks",
      duration: "4 hours 10 minutes",
      lectures: [
        {
          id: 13,
          title: "Introduction to Hooks",
          duration: "15:30",
          preview: false,
        },
        { id: 14, title: "useState Hook", duration: "25:45", preview: true },
        { id: 15, title: "useEffect Hook", duration: "30:20", preview: false },
        { id: 16, title: "useContext Hook", duration: "22:15", preview: false },
        { id: 17, title: "useReducer Hook", duration: "28:40", preview: false },
        {
          id: 18,
          title: "useCallback and useMemo",
          duration: "35:10",
          preview: false,
        },
        { id: 19, title: "Custom Hooks", duration: "40:25", preview: false },
        {
          id: 20,
          title: "Project: Task Management App with Hooks",
          duration: "72:00",
          preview: false,
        },
      ],
    },
    {
      id: 4,
      title: "Routing with React Router",
      duration: "2 hours 30 minutes",
      lectures: [
        {
          id: 21,
          title: "Introduction to React Router",
          duration: "15:20",
          preview: false,
        },
        {
          id: 22,
          title: "Router Installation and Configuration",
          duration: "12:40",
          preview: false,
        },
        {
          id: 23,
          title: "Route Parameters",
          duration: "18:30",
          preview: false,
        },
        { id: 24, title: "Nested Routes", duration: "20:15", preview: false },
        {
          id: 25,
          title: "Protected Routes",
          duration: "25:45",
          preview: false,
        },
        {
          id: 26,
          title: "Project: Building a Multi-page Application",
          duration: "58:00",
          preview: false,
        },
      ],
    },
    {
      id: 5,
      title: "State Management with Redux",
      duration: "5 hours 15 minutes",
      lectures: [
        {
          id: 27,
          title: "Introduction to Redux",
          duration: "20:30",
          preview: false,
        },
        {
          id: 28,
          title: "Actions, Reducers, and Store",
          duration: "30:45",
          preview: false,
        },
        {
          id: 29,
          title: "Redux with React",
          duration: "25:20",
          preview: false,
        },
        {
          id: 30,
          title: "Redux Middleware",
          duration: "28:15",
          preview: false,
        },
        { id: 31, title: "Redux Thunk", duration: "35:40", preview: false },
        { id: 32, title: "Redux Toolkit", duration: "45:10", preview: false },
        {
          id: 33,
          title: "Project: E-commerce App with Redux",
          duration: "90:00",
          preview: false,
        },
      ],
    },
  ];

  const filteredSections = sections
    .map((section) => ({
      ...section,
      lectures: section.lectures.filter((lecture) =>
        lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.lectures.length > 0);

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

      <Accordion type="single" collapsible className="w-full">
        <AnimatePresence>
          {filteredSections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AccordionItem value={`section-${section.id}`} className="border">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex flex-1 items-center justify-between pr-4">
                    <div className="text-left font-medium">{section.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {section.lectures.length} lectures • {section.duration}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  <ul className="divide-y">
                    {section.lectures.map((lecture) => (
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
                          {lecture.duration}
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
