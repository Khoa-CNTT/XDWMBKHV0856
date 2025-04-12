import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

const CourseAddModal = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [students, setStudents] = useState(0);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("Draft");

  const [sections, setSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [newLecture, setNewLecture] = useState({
    title: "",
    video: null,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLecture({ ...newLecture, video: file });
    }
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim() === "") return;
    const newSection = {
      title: newSectionTitle,
      lessons: [],
    };
    setSections([...sections, newSection]);
    setNewSectionTitle("");
  };

  const handleDeleteSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleToggleSection = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handleAddLecture = (sectionIndex) => {
    const { title, video } = newLecture;
    if (!title || !video) return;

    const updatedSections = [...sections];
    updatedSections[sectionIndex].lessons.push({ title, video });
    setSections(updatedSections);

    setNewLecture({ title: "", video: null });
  };

  const handleDeleteLecture = (sectionIndex, lectureIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].lessons.splice(lectureIndex, 1);
    setSections(updatedSections);
  };

  const handleAdd = () => {
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
    };

    onAdd(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[90vw] max-w-5xl h-[90vh] rounded-2xl shadow-2xl p-8 relative overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Add New Course
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Title</label>
              <input
                className="p-3 border border-gray-300 rounded-lg bg-gray-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course title..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Price</label>
              <input
                className="p-3 border border-gray-300 rounded-lg bg-gray-50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Course price..."
                type="number"
                min="0"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <label className="font-semibold">Course Image</label>
            <label className="w-40 h-40 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center bg-gray-50 overflow-hidden relative">
              {image ? (
                <img
                  src={image}
                  alt="Course"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Click to upload</span>
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
          <label className="font-semibold">Description</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course description..."
            rows={3}
          />
        </div>

        <div className="mt-8">
          <label className="font-semibold text-lg text-gray-800">
            Add Chapter
          </label>
          <div className="flex gap-2 mt-2">
            <input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Chapter title..."
              className="p-3 border border-gray-300 rounded-lg bg-gray-50 flex-1"
            />
            <button
              onClick={handleAddSection}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          </div>

          <div className="space-y-4 mt-6">
            {sections.map((section, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-3 bg-gray-100">
                  <button
                    onClick={() => handleToggleSection(index)}
                    className="flex-1 text-left font-semibold"
                  >
                    {section.title}
                  </button>
                  <button
                    onClick={() => handleDeleteSection(index)}
                    className="text-red-500 hover:text-red-700 ml-4"
                    title="Delete Chapter"
                  >
                    <Trash2 size={18} />
                  </button>
                  <span className="ml-2 cursor-pointer">
                    {expandedIndex === index ? (
                      <ChevronUp onClick={() => handleToggleSection(index)} />
                    ) : (
                      <ChevronDown onClick={() => handleToggleSection(index)} />
                    )}
                  </span>
                </div>

                {expandedIndex === index && (
                  <div className="p-4 space-y-4 bg-gray-50">
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Lecture Title"
                        value={newLecture.title}
                        onChange={(e) =>
                          setNewLecture({
                            ...newLecture,
                            title: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded"
                      />

                      <div>
                        <label className="block mb-1 font-medium">
                          Upload Video
                        </label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="block w-full"
                        />
                        {newLecture.video && (
                          <p className="mt-1 text-sm text-green-700">
                            📹 {newLecture.video.name}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddLecture(index)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Add Lecture
                      </button>
                    </div>

                    {section.lessons.length > 0 && (
                      <div className="space-y-2 mt-4">
                        {section.lessons.map((lesson, idx) => (
                          <div
                            key={idx}
                            className="p-3 border rounded bg-white shadow-sm flex justify-between items-center"
                          >
                            <div>
                              <p className="font-semibold">{lesson.title}</p>
                              <p className="text-sm text-gray-500">
                                🎞️ {lesson.video?.name}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteLecture(index, idx)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Lecture"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
