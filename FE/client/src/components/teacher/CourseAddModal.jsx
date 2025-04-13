// ... (các import giữ nguyên)
import React, { useState } from "react";
import CourseSectionEditor from "./CourseSectionEditor";
import { BookOpen, DollarSign, FileText } from "lucide-react";

const CourseAddModal = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [students, setStudents] = useState(0);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("Draft");
  const [sections, setSections] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [relatedParts, setRelatedParts] = useState([]);
  const [relatedSkill, setRelatedSkill] = useState([]);

  const [errors, setErrors] = useState({
    title: false,
    price: false,
    description: false,
    relatedParts: false,
    relatedSkill: false,
    lectures: false,
    chapters: false,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleAdd = () => {
    let valid = true;

    const hasNoChapters = sections.length === 0;
    const hasEmptyLectures = sections.some(
      (section) => !section.lessons || section.lessons.length === 0
    );

    const newErrors = {
      title: !title.trim(),
      price: !price,
      description: !description.trim(),
      relatedParts: relatedParts.length === 0,
      relatedSkill: relatedSkill.length === 0,
      chapters: hasNoChapters,
      lectures: hasEmptyLectures,
    };

    setErrors(newErrors);

    for (let key in newErrors) {
      if (newErrors[key]) valid = false;
    }

    if (!valid) {
      alert("❗ Please fill in all required fields.");
      return;
    }

    const newCourse = {
      id: Date.now(),
      title,
      price: parseFloat(price),
      descriptionout: description,
      image,
      students: parseInt(students),
      rating: parseFloat(rating),
      status,
      active: false,
      sections,
      relatedParts,
      relatedSkill,
    };

    onAdd(newCourse);
    onClose();
  };

  const handleRelatedPartsChange = (part) => {
    if (relatedParts.length < 3 || relatedParts.includes(part)) {
      setRelatedParts((prev) =>
        prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
      );
    } else {
      alert("You can select a maximum of 3 related parts.");
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
    <div className="fixed inset-0 bg-book-pattern bg-red-maroon bg-blend-overlay bg-cover animate-floating-books flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white via-red-50 to-purple-50 w-[90vw] max-w-5xl h-[90vh] rounded-2xl shadow-2xl p-8 relative overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Add New Course
        </h2>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold flex items-center gap-2">
                <BookOpen size={18} /> Title
              </label>
              <input
                className={`p-3 border ${
                  errors.title ? "border-red-500" : "border-red-300"
                } rounded-lg bg-red-50`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course title..."
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm">Title is required.</p>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold flex items-center gap-2">
                <DollarSign size={18} /> Price
              </label>
              <input
                className={`p-3 border ${
                  errors.price ? "border-red-500" : "border-red-300"
                } rounded-lg bg-red-50`}
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

          {/* Image Upload */}
          <div className="flex flex-col items-center justify-center gap-2">
            <label className="font-semibold">Course Image</label>
            <label className="w-40 h-40 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center bg-red-50 overflow-hidden relative">
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

        {/* Description */}
        <div className="mt-6">
          <label className="font-semibold flex items-center gap-2">
            <FileText size={18} /> Description
          </label>
          <textarea
            className={`w-full p-3 border ${
              errors.description ? "border-red-500" : "border-red-300"
            } rounded-lg bg-red-50`}
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

        {/* Related Parts */}
        <div className="mt-6 border rounded-xl p-4 bg-red-50/50">
          <label className="font-semibold block mb-2 text-black-600">
            Related Parts
          </label>
          <div className="flex flex-wrap gap-3">
            {["Introduction", "Theory", "Practice", "Summary"].map((part) => {
              const isSelected = relatedParts.includes(part);
              return (
                <label
                  key={part}
                  className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-200
                    ${
                      isSelected
                        ? "bg-red-500 text-white"
                        : "bg-white text-red-800 border border-red-500 hover:bg-red-100"
                    }`}
                >
                  <input
                    type="checkbox"
                    value={part}
                    checked={isSelected}
                    onChange={() => handleRelatedPartsChange(part)}
                    className="hidden"
                  />
                  {part}
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

        {/* Skills */}
        {relatedParts.length > 0 && (
          <div className="mt-4 border rounded-xl p-4 bg-red-50/50">
            <label className="font-semibold block mb-2 text-black-800">
              Skills
            </label>
            <div className="flex flex-wrap gap-3">
              {["Listening", "Reading", "Writing", "Speaking"].map((skill) => {
                const isSelected = relatedSkill.includes(skill);
                return (
                  <label
                    key={skill}
                    className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-200
                      ${
                        isSelected
                          ? "bg-red-500 text-white"
                          : "bg-white text-red-800 border border-red-300 hover:bg-red-100"
                      }`}
                  >
                    <input
                      type="checkbox"
                      value={skill}
                      checked={isSelected}
                      onChange={() => handleRelatedSkillChange(skill)}
                      className="hidden"
                    />
                    {skill}
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

        {/* Section Editor */}
        <CourseSectionEditor
          sections={sections}
          setSections={setSections}
          expandedIndex={expandedIndex}
          setExpandedIndex={setExpandedIndex}
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

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Actions */}
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
