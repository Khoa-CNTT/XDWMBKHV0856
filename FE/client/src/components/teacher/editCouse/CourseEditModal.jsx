import React, { useState, useEffect } from "react";
// import CourseSectionEditor from "./CourseSectionEditor";
import { BookOpen, DollarSign, FileText } from "lucide-react";
import CourseEditModalSection from "./CourseEditModalSection";

const CourseEditModal = ({ onClose, onSave, courseId }) => {
  // Giả lập dữ liệu khóa học đã được thêm trước đó (fake API)
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [sections, setSections] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [relatedParts, setRelatedParts] = useState([]);
  const [relatedSkill, setRelatedSkill] = useState([]);
  const [fields, setFields] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const chapterError = sections.length === 0;
  const lectureError = sections.some(
    (section) => !section.lessons || section.lessons.length === 0
  );

  const [errors, setErrors] = useState({
    title: false,
    price: false,
    description: false,
    relatedParts: false,
    relatedSkill: false,
    lectures: false,
    chapters: false,
  });

  useEffect(() => {
    // Giả lập lấy dữ liệu khóa học
    const fetchCourseData = () => {
      // Giả lập thông tin khóa học
      const courseData = {
        title: "Sample Course Title",
        price: "100",
        description: "This is a sample course description.",
        image: "https://via.placeholder.com/150",
        sections: [
          {
            title: "Chapter 1",
            lessons: [
              { title: "Lesson 1", video: { name: "video1.mp4" } },
              { title: "Lesson 2", video: { name: "video2.mp4" } },
            ],
          },
        ],
        relatedParts: [1, 2],
        relatedSkills: ["Skill 1", "Skill 2"],
      };

      setTitle(courseData.title);
      setPrice(courseData.price);
      setDescription(courseData.description);
      setImage(courseData.image);
      setSections(courseData.sections);
      setRelatedParts(courseData.relatedParts);
      setRelatedSkill(courseData.relatedSkills);
    };

    fetchCourseData();
  }, [courseId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSectionsChange = (updatedSections) => {
    setSections(updatedSections);
  };

  const handleSave = () => {
    const newErrors = {
      title: !title.trim(),
      price: !price,
      description: !description.trim(),
      relatedParts: relatedParts.length === 0,
      relatedSkill: relatedSkill.length === 0,
      chapters: chapterError,
      lectures: lectureError,
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((val) => val);
    if (hasErrors) {
      alert("Please fill in all required fields.");
      return;
    }

    // Giả lập lưu dữ liệu
    console.log("Course saved:", {
      title,
      price,
      description,
      sections,
      image,
      relatedParts,
      relatedSkill,
    });
    alert("Course saved successfully!");
    onSave(); // Đóng modal khi lưu xong
  };

  return (
    <div className="fixed inset-0 bg-red-maroon bg-blend-overlay bg-cover animate-floating-books flex items-center justify-center z-50">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      <div className="bg-red-50 from-white via-red-50 to-purple-50 w-[90vw] max-w-5xl h-[90vh] rounded-2xl shadow-2xl p-8 relative overflow-y-auto">
        {/* Nút đóng (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl font-bold text-gray-800 hover:text-gray-600"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Course</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold flex items-center gap-2">
                <BookOpen size={18} /> Title
              </label>
              <input
                className={`p-3 border ${
                  errors.title ? "border-black" : "border-black"
                } rounded-lg bg-white`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course title..."
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm">Title is required.</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold flex items-center gap-2">
                <DollarSign size={18} /> Price
              </label>
              <input
                className={`p-3 border ${
                  errors.price ? "border-black" : "border-black"
                } rounded-lg bg-white-50`}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Course price..."
                type="number"
                min="0"
                required
              />
              {errors.price && (
                <p className="text-red-500 text-sm">Price is required.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <label className="font-semibold">Course Image</label>
            <label className="w-40 h-40 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center bg-white overflow-hidden relative">
              {image ? (
                <img
                  src={image}
                  alt="Course"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-black-400">Click to upload</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="font-semibold flex items-center gap-2">
            <FileText size={18} /> Description
          </label>
          <textarea
            className={`w-full p-3 border ${
              errors.description ? "border-black" : "border-black"
            } rounded-lg bg-white-50`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course description..."
            rows={3}
            required
          />
          {errors.description && (
            <p className="text-red-500 text-sm">Description is required.</p>
          )}
        </div>

        <div className="mt-6 border border-black rounded-xl p-4 bg-white">
          <div className=" flex gap-4 mb-4 p-2 justify-between">
            <label className="font-semibold block mb-2 text-black-600">
              Field
            </label>
            <input
              type="text"
              placeholder="Search field..."
              className="w-1/2 p-2 rounded-lg border border-gray-500 bg-white"
            />
          </div>
        </div>
        <div className="mt-6 border border-black rounded-xl p-4 bg-white">
          <div className="flex gap-4 mb-4 p-2 justify-between">
            <label className="font-semibold block mb-2 text-black-600">
              Skill
            </label>
            <input
              type="text"
              placeholder="Search skill..."
              className="w-1/2 p-2 rounded-lg border border-gray-500 bg-white"
            />
          </div>
        </div>

        <CourseEditModalSection
          sections={sections}
          setSections={setSections}
          expandedIndex={expandedIndex}
          setExpandedIndex={setExpandedIndex}
          onSectionsChange={handleSectionsChange}
        />

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Course
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditModal;
