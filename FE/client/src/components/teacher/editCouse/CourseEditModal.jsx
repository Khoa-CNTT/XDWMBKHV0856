import React, { useState, useEffect } from "react";
import { FiBookOpen, FiDollarSign, FiFileText } from "react-icons/fi";
import CourseEditModalSection from "./CourseEditModalSection";
import { toast } from "react-toastify";
import { getFields } from "../../../services/field.services";
import { getSkillsByFieldIds } from "../../../services/ModuleSkill.Sevices";
import {
  getCourse,
  updateCourse,
  updateChapter,
  deleteChapter,
  deleteLecture,
  updateFileLecture,
  updateLecture,
  createChapter,
  createLecture,
  updateImageCourse,
} from "../../../services/course.services";

const CourseEditModal = ({ onClose, onSave, courseId }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [shortIntroduce, setshortIntroduce] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [courseImage, setCourseImage] = useState(null);
  const [sections, setSections] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [relatedParts, setRelatedParts] = useState([]);
  const [relatedSkill, setRelatedSkill] = useState({});
  const [fields, setFields] = useState([]);
  const [skills, setSkills] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [searchSkill, setSearchSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletedChapters, setDeletedChapters] = useState([]);
  const [deletedLectures, setDeletedLectures] = useState([]);

  const [originalSections, setOriginalSections] = useState([]);

  const chapterError = sections.length === 0;
  const lectureError = sections.some(
    (section) => !section.lessons || section.lessons.length === 0
  );

  const [errors, setErrors] = useState({
    title: false,
    price: false,
    shortIntroduce: false,
    description: false,
    relatedParts: false,
    relatedSkill: false,
    lectures: false,
    chapters: false,
  });

  useEffect(() => {
    // Khi mở modal, lưu lại dữ liệu ban đầu để so sánh
    setOriginalSections(JSON.parse(JSON.stringify(sections)));
  }, []);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      try {
        const data = await getCourse(courseId);
        // Set data to state
        setTitle(data.title);
        setPrice(data.price);
        setshortIntroduce(data.shortIntroduce);
        setDescription(data.description);
        setImage(data.image);

        setSections(
          data.chapters.map((chapter) => ({
            id: chapter.id,
            title: chapter.title,
            lessons: chapter.lectures.map((lecture) => ({
              id: lecture.id,
              title: lecture.title,
              description: lecture.description,
              preview: lecture.preview,
              video: lecture.file,
              videoUrl: lecture.id
                ? `${import.meta.env.VITE_LECTURE_URL}/${lecture.id}/${
                    lecture.file
                  }`
                : "",
            })),
          }))
        );

        setRelatedParts(data.fields.map((field) => field.id));
        setRelatedSkill(
          data.fields.reduce((acc, field) => {
            acc[field.id] = field.skills
              ? field.skills.map((skill) => skill.name)
              : [];
            return acc;
          }, {})
        );

        // Lưu dữ liệu gốc
        setOriginalSections(
          data.chapters.map((chapter) => ({
            id: chapter.id,
            title: chapter.title,
            lessons: chapter.lectures.map((lecture) => ({
              id: lecture.id,
              title: lecture.title,
              description: lecture.description,
              preview: lecture.preview,
              video: lecture.file,
              videoUrl: lecture.id
                ? `${import.meta.env.VITE_LECTURE_URL}/${lecture.id}/${
                    lecture.file
                  }`
                : "",
            })),
          }))
        );
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to fetch course data.");
      }
    };

    fetchCourseData();
  }, [courseId]);

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
      if (relatedParts.length > 0) {
        try {
          const fetchedSkills = await getSkillsByFieldIds(relatedParts);
          setSkills(fetchedSkills);
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      } else {
        setSkills([]);
      }
    };
    fetchSkills();
  }, [relatedParts]);

  const skillsByField = {};
  skills.forEach((skill) => {
    const fieldId = skill.field.id;
    if (!skillsByField[fieldId]) skillsByField[fieldId] = [];
    skillsByField[fieldId].push(skill);
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setCourseImage(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const sectionsToUpdate = sections.filter((section) => section.id);

      // 1. XÓA LECTURES
      for (const lectureId of deletedLectures) {
        try {
          await deleteLecture(lectureId);
        } catch (err) {
          console.error(`Failed to delete lecture ${lectureId}:`, err);
        }
      }

      // 2. XÓA CHAPTERS
      for (const chapterId of deletedChapters) {
        try {
          await deleteChapter(chapterId);
        } catch (err) {
          console.error(`Failed to delete chapter ${chapterId}:`, err);
        }
      }

      // 3. CẬP NHẬT ẢNH KHÓA HỌC MỚI
      if (courseImage) {
        try {
          await updateImageCourse(courseImage, courseId);
        } catch (error) {
          console.error("Failed to update course image:", error);
          toast.error("Failed to update course image.");
        }
      }

      // 3.1 CẬP NHẬT CÁC CHAPTER ĐÃ CÓ
      for (const section of sectionsToUpdate) {
        const originalSection = originalSections?.find(
          (s) => s.id === section.id
        );
        const isChapterChanged =
          !originalSection || originalSection.title !== section.title;

        if (isChapterChanged) {
          await updateChapter({ id: section.id, title: section.title });
        } else {
        }

        for (const lesson of section.lessons || []) {
          const originalLesson = originalSection?.lessons?.find(
            (l) => l.id === lesson.id
          );
          const isLectureChanged =
            originalLesson &&
            (originalLesson.title !== lesson.title ||
              originalLesson.description !== lesson.description ||
              originalLesson.preview !== lesson.preview);

          if (lesson.id && isLectureChanged) {
            await updateLecture({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              preview: lesson.preview,
            });
          } else if (lesson.id) {
          }

          if (lesson.id && lesson.video instanceof File) {
            await updateFileLecture(lesson.video, lesson.id);
          } else if (lesson.id) {
          }
        }
      }

      // 4 & 5. TẠO MỚI CHAPTER & LECTURE
      for (const section of sections) {
        // Tạo chapter nếu chưa có
        if (!section.id) {
          const createdChapter = await createChapter({
            title: section.title,
            course: { id: courseId },
          });

          if (createdChapter?.data?.id) {
            // Correctly assign the chapter ID from the response
            section.id = createdChapter.data.id;
          } else {
            console.error(
              "Failed to create chapter, no valid id returned:",
              createdChapter
            );
            continue; // Skip creating lectures if chapter creation failed
          }
        }

        // Tạo lecture nếu chưa có
        for (const lesson of section.lessons || []) {
          if (!lesson.id) {
            const newLecture = {
              title: lesson.title,
              description: lesson.description,
              preview: lesson.isActive || false,
              chapter: { id: section.id }, // Ensure the section ID is correctly passed here
            };

            const createdLecture = await createLecture(newLecture);
            const lectureId = createdLecture;

            if (!lectureId) {
              console.error("❌ Failed to get lecture ID. Skipping:", lesson);
              continue;
            }

            lesson.id = lectureId;
            if (lesson.video instanceof File) {
              await updateFileLecture(lesson.video, lectureId);
            } else {
            }
          }
        }
      }

      // 6. CẬP NHẬT KHÓA HỌC
      const payload = {
        id: courseId,
        title,
        shortIntroduce,
        description,
        price: Number(price),
        fields: relatedParts.map((id) => ({ id })),
        skills: skills
          .filter((skill) => relatedSkill[skill.field.id]?.includes(skill.name))
          .map((skill) => ({ id: skill.id })),
      };
      await updateCourse(payload);

      onClose();
      toast.success("Course updated successfully!", { autoClose: 1000 });
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Failed to update course:", error);
      toast.error("Failed to update course!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionsChange = (updatedSections) => {
    setSections(updatedSections);
  };

  const handleRelatedPartsChange = async (fieldId) => {
    let updatedIds = [];
    let newRelatedSkill = { ...relatedSkill }; // Mới tạo bản sao của relatedSkill

    const isRemoving = relatedParts.includes(fieldId);

    if (isRemoving) {
      updatedIds = relatedParts.filter((id) => id !== fieldId);
    } else {
      if (relatedParts.length >= 3) {
        toast.warn("You can select a maximum of 3 related parts.", {
          toastId: `skill-limit-${fieldId}`,
          position: "top-center",
          autoClose: 500,
        });

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
        delete newRelatedSkill[fieldId];
        setRelatedSkill(newRelatedSkill);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleRelatedSkillChange = (fieldId, skillName) => {
    setRelatedSkill((prev) => {
      const currentFieldSkills = prev[fieldId] || [];

      const isSelected = currentFieldSkills.includes(skillName);

      if (isSelected) {
        // Bỏ chọn
        const updated = currentFieldSkills.filter((s) => s !== skillName);
        return { ...prev, [fieldId]: updated };
      } else {
        if (currentFieldSkills.length >= 3) {
          toast.dismiss("skill-limit");
          toast.warn("You can select a maximum of 3 skills for each field.", {
            toastId: `skill-limit-${fieldId}`,
            position: "top-center",
            autoClose: 500,
          });
          return prev;
        }
        const updated = [...currentFieldSkills, skillName];
        return { ...prev, [fieldId]: updated };
      }
    });
  };

  const handleDeleteChapter = (DltchapterId) => {
    setDeletedChapters((prev) => [...prev, DltchapterId]);
  };

  const handleDeleteLecture = async (DltlectureId) => {
    setDeletedLectures((prev) => [...prev, DltlectureId]);
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
                <FiBookOpen size={18} /> Title
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
                <FiDollarSign size={18} /> Price
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
              {courseImage ? (
                <img
                  src={URL.createObjectURL(courseImage)} // Ưu tiên ảnh người dùng upload
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : image ? (
                <img
                  src={`${
                    import.meta.env.VITE_COURSE_IMAGE_URL
                  }/${courseId}/${image}`} // Ảnh từ server
                  alt={title}
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

        {/* Introduce */}
        <div className="mt-6">
          <label className="font-semibold flex items-center gap-2">
            <FiFileText size={18} /> Short Introduce
          </label>
          <textarea
            className={`w-full p-3 border ${
              errors.shortIntroduce ? "border-red-500" : "border-black"
            } rounded-lg bg-white`}
            value={shortIntroduce}
            onChange={(e) => setshortIntroduce(e.target.value)}
            placeholder="short Introduce..."
            rows={1}
            required
          />
          {errors.shortIntroduce && (
            <p className="text-red-500 text-sm">
              SShort Introduce is required.
            </p>
          )}
        </div>

        <div className="mt-6">
          <label className="font-semibold flex items-center gap-2">
            <FiFileText size={18} /> Description
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
          <div className="flex gap-4 mb-4 p-2 justify-between">
            <label className="font-semibold block text-black-600">Field</label>
            <input
              type="text"
              placeholder="Search field..."
              className="w-1/2 p-2 rounded-lg border border-gray-500 bg-white"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {fields
              .filter((field) =>
                field.name.toLowerCase().includes(searchField.toLowerCase())
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
        </div>

        {/* Skills */}
        <div className="mt-6 border border-black rounded-xl p-4 bg-white">
          <div className="flex gap-4 mb-4 p-2 justify-between">
            <label className="font-semibold block text-black-600">Skill</label>
            <input
              type="text"
              placeholder="Search skill..."
              className="w-1/2 p-2 rounded-lg border border-gray-500 bg-white"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-6">
            {Object.entries(skillsByField).map(([fieldId, skillList]) => (
              <div key={fieldId}>
                <h4 className="font-semibold text-red-600 mb-2">
                  {fields.find((f) => f.id === Number(fieldId))?.name ||
                    "Unknown Field"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillList
                    .filter((skill) =>
                      skill.name
                        .toLowerCase()
                        .includes(searchSkill.toLowerCase())
                    )
                    .map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() =>
                          handleRelatedSkillChange(fieldId, skill.name)
                        }
                        className={`px-4 py-2 rounded-full text-sm ${
                          relatedSkill[fieldId]?.includes(skill.name)
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {skill.name}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <CourseEditModalSection
          sections={sections}
          setSections={setSections}
          expandedIndex={expandedIndex}
          setExpandedIndex={setExpandedIndex}
          onSectionsChange={handleSectionsChange}
          onDeleteChapter={handleDeleteChapter}
          onDeleteLecture={handleDeleteLecture}
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
