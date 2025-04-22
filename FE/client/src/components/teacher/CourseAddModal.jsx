import React, { useState, useEffect } from "react";
import CourseSectionEditor from "./CourseSectionEditor";
import { toast } from "react-toastify";
import { BookOpen, DollarSign, FileText } from "lucide-react";
import { getFields } from "../../services/field.services";
import { getSkillsByFieldIds } from "../../services/ModuleSkill.Sevices";
import { getCurrentUser } from "../../services/auth.services";
import {
  updateImageCourse,
  getNewCourseId,
  createCourse,
  createChapter,
  updateLecture,
  createLecture,
} from "../../services/course.services";

const CourseAddModal = ({ onClose, onAdd }) => {
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
  const [userId, setUserId] = useState(null);
  const [courseImage, setCourseImage] = useState(null);
  const chapterError = sections.length === 0;
  const lectureError = sections.some(
    (section) => !section.lessons || section.lessons.length === 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");

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
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.id);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const data = await getFields();
        setFields(data.result);
      } catch (error) {
        console.error("Failed to fetch fields", error);
      }
    };
    fetchFields();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      const storedIds =
        JSON.parse(localStorage.getItem("selectedFieldIds")) || [];
      if (storedIds.length > 0) {
        try {
          const fetchedSkills = await getSkillsByFieldIds(storedIds);
          setSkills(fetchedSkills);
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      }
    };
    fetchSkills();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setCourseImage(file);
    }
  };

  const handleRelatedPartsChange = async (fieldId) => {
    let updatedIds = [];
    let newRelatedSkill = [...relatedSkill];

    const isRemoving = relatedParts.includes(fieldId);

    if (isRemoving) {
      updatedIds = relatedParts.filter((id) => id !== fieldId);
    } else {
      if (relatedParts.length >= 3) {
        alert("You can select a maximum of 3 related parts.");
        return;
      }
      updatedIds = [...relatedParts, fieldId];
    }

    setRelatedParts(updatedIds);
    localStorage.setItem("selectedFieldIds", JSON.stringify(updatedIds));

    try {
      const fetchedSkills = await getSkillsByFieldIds(updatedIds);
      setSkills(fetchedSkills);

      if (isRemoving) {
        const remainingSkillNames = fetchedSkills.map((skill) => skill.name);
        newRelatedSkill = relatedSkill.filter((skillName) =>
          remainingSkillNames.includes(skillName)
        );
        setRelatedSkill(newRelatedSkill);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleSectionsChange = (updatedSections) => {
    setSections(updatedSections);
    console.log("Danh sách sections mới:", updatedSections);

    updatedSections.forEach((section, i) => {
      console.log(`Section ${i + 1}: ${section.title}`);
      section.lessons.forEach((lesson, j) => {
        console.log(`Lecture ${j + 1}: ${lesson.title}`);
        if (lesson.video?.name) {
          console.log(`Video file: ${lesson.video.name}`);
        }
      });
    });
  };

  const handleAdd = async () => {
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
      toast.error("❗ Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    const selectedFieldObjs = relatedParts.map((id) => ({ id }));
    const selectedSkillObjs = skills
      .filter((s) => relatedSkill.includes(s.name))
      .map((s) => ({ id: s.id }));

    const courseData = {
      title,
      description,
      price: parseFloat(price),
      owner: { id: userId },
      fields: selectedFieldObjs,
      skills: selectedSkillObjs,
    };

    try {
      await createCourse(courseData);
      const myCourses = await getNewCourseId(userId);
      const latestCourse = myCourses?.[myCourses.length - 1];
      if (!latestCourse) throw new Error("Cannot find newly created course");

      const createdChapters = [];
      for (const section of sections) {
        const res = await createChapter({
          title: section.title,
          course: { id: latestCourse.id },
        });
        createdChapters.push(res?.data);
      }

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const chapterId = createdChapters[i]?.id;
        if (!chapterId) continue;

        for (const lesson of section.lessons || []) {
          try {
            const lectureData = {
              title: lesson.title,
              chapter: { id: chapterId },
            };

            const createdLecture = await createLecture(lectureData);
            await updateLecture(lesson.video, createdLecture);
          } catch (err) {
            console.error("❗ Error creating lecture:", err);
          }
        }
      }

      if (image) {
        await updateImageCourse(courseImage, latestCourse.id);
      }

      toast.success("Course created successfully!", { autoClose: 1000 });
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error("Lỗi khi tạo khóa học:", err);
      toast.error(
        "❌ Lỗi khi tạo khóa học: " + (err?.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelatedSkillChange = (skill) => {
    if (relatedSkill.length < 3 || relatedSkill.includes(skill)) {
      setRelatedSkill((prev) =>
        prev.includes(skill)
          ? prev.filter((s) => s !== skill)
          : [...prev, skill]
      );
    } else {
      alert("You can select a maximum of 3 skills.");
    }
  };

  return (
    <div className="fixed inset-0 bg-red-maroon bg-blend-overlay bg-cover animate-floating-books flex items-center justify-center z-50">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      <div className="bg-red-50 from-white via-red-50 to-purple-50 w-[90vw] max-w-5xl h-[90vh] rounded-2xl shadow-2xl p-8 relative overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Add New Course
        </h2>

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
              value={fieldSearch}
              onChange={(e) => setFieldSearch(e.target.value)}
              placeholder="Search field..."
              className=" w-1/2 p-2 rounded-lg border border-gray-500 bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {fields
              .filter((field) =>
                field.name.toLowerCase().includes(fieldSearch.toLowerCase())
              )
              .map((field) => {
                const isSelected = relatedParts.includes(field.id);
                return (
                  <label
                    key={field.id}
                    className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-200
                      ${
                        isSelected
                          ? "bg-red-500 text-white"
                          : "bg-white text-red-800 border border-red-300 hover:bg-red-100"
                      }`}
                  >
                    <input
                      type="checkbox"
                      value={field.id}
                      checked={isSelected}
                      onChange={() => handleRelatedPartsChange(field.id)}
                      className="hidden"
                    />
                    {field.name}
                  </label>
                );
              })}
          </div>
          {errors.relatedParts && (
            <p className="text-red-500 text-sm">
              At least one related part is required.
            </p>
          )}
        </div>

        {relatedParts.length > 0 && skills.length > 0 && (
          <div className="mt-4 border border-black rounded-xl p-4 bg-white">
            <div className=" flex gap-4 mb-4 p-2 justify-between">
              <label className="font-semibold block mb-2 text-black-800">
                Skills
              </label>
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search skills..."
                className="w-1/2 p-2 rounded-lg border border-gray-500 bg-white "
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {skills
                .filter((skill) =>
                  skill.name.toLowerCase().includes(skillSearch.toLowerCase())
                )
                .map((skill) => {
                  const isSelected = relatedSkill.includes(skill.name);
                  return (
                    <label
                      key={skill.id}
                      className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-200
                        ${
                          isSelected
                            ? "bg-red-500 text-white"
                            : "bg-white text-red-800 border border-red-300 hover:bg-red-100"
                        }`}
                    >
                      <input
                        type="checkbox"
                        value={skill.name}
                        checked={isSelected}
                        onChange={() => handleRelatedSkillChange(skill.name)}
                        className="hidden"
                      />
                      {skill.name}
                    </label>
                  );
                })}
            </div>
            {errors.relatedSkill && (
              <p className="text-red-500 text-sm">
                At least one skill is required.
              </p>
            )}
          </div>
        )}

        <CourseSectionEditor
          sections={sections}
          setSections={setSections}
          expandedIndex={expandedIndex}
          setExpandedIndex={setExpandedIndex}
          onSectionsChange={handleSectionsChange}
        />
        {errors.chapters && (
          <p className="text-red-500 text-sm">
            At least one chapter is required.
          </p>
        )}
        {errors.lectures && (
          <p className="text-red-500 text-sm">
            Each chapter must have at least one lecture.
          </p>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Course
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

export default CourseAddModal;
