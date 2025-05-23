import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiTrash2,
  FiVideo,
  FiEye,
  FiEyeOff,
  FiPlusCircle,
  FiSave,
  FiXCircle,
  FiX,
} from "react-icons/fi";
import ToggleSwitch from "../ToggleSwitch";

const CourseEditModalSection = ({
  sections,
  setSections,
  expandedIndex,
  setExpandedIndex,
  onSectionsChange,
  onDeleteChapter,
  onDeleteLecture,
}) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newLecture, setNewLecture] = useState({
    title: "",
    description: "",
    video: null,
    isActive: false,
  });

  const [editLectureIndex, setEditLectureIndex] = useState({
    section: null,
    lecture: null,
  });
  const [editLecture, setEditLecture] = useState({
    title: "",
    description: "",
    video: null,
  });
  const [editSectionIndex, setEditSectionIndex] = useState(null);
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [videoPreviewEnabled, setVideoPreviewEnabled] = useState({});
  const [lectureError, setLectureError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAddLectureForm, setShowAddLectureForm] = useState({});
  const [deletedChapters, setDeletedChapters] = useState([]);
  const [deletedLectures, setDeletedLectures] = useState([]);

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection = { title: newSectionTitle, lessons: [] };
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    onSectionsChange(updatedSections);
    setNewSectionTitle("");
  };

  const handleToggleSection = (index) => {
    // Toggle the expanded state of the section
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleAddLecture = (sectionIndex) => {
    if (!newLecture.title || !newLecture.video) {
      setLectureError("Vui lòng nhập tiêu đề và chọn video.");
      return;
    }
    const updatedSections = [...sections];
    const newLesson = {
      title: newLecture.title,
      description: newLecture.description,
      video: newLecture.video,
      isActive: newLecture.isActive,
    };
    updatedSections[sectionIndex].lessons.push(newLesson);
    setSections(updatedSections);
    onSectionsChange(updatedSections);
    setNewLecture({ title: "", description: "", video: null, isActive: false });
    setLectureError("");
  };

  const handleDeleteLecture = (sectionIndex, lectureIndex) => {
    const lectureToDelete = sections[sectionIndex]?.lessons[lectureIndex];

    setDeleteTarget({
      type: "lecture",
      id: lectureToDelete?.id || null,
      sectionIndex,
      lectureIndex,
    });
    setConfirmDelete(true);
  };

  const handleDeleteSection = (sectionIndex) => {
    const sectionToDelete = sections[sectionIndex];

    // Không cần kiểm tra id ở đây
    setDeleteTarget({
      type: "section",
      id: sectionToDelete?.id || null, // Nếu có id thì lưu, không thì null
      sectionIndex,
    });
    setConfirmDelete(true);
  };

  const confirmDeleteAction = () => {
    if (!deleteTarget) return;

    const updated = [...sections];

    if (deleteTarget.type === "lecture") {
      // Xóa lecture trong UI
      updated[deleteTarget.sectionIndex].lessons.splice(
        deleteTarget.lectureIndex,
        1
      );

      // Nếu lecture có id, thêm vào deletedLectures
      if (deleteTarget.id) {
        setDeletedLectures((prev) => [...prev, deleteTarget.id]);
        onDeleteLecture?.(deleteTarget.id);
      }
    } else if (deleteTarget.type === "section") {
      // Xóa section trong UI
      updated.splice(deleteTarget.sectionIndex, 1);

      // Nếu section có id, thêm vào deletedChapters
      if (deleteTarget.id) {
        setDeletedChapters((prev) => {
          if (!prev.includes(deleteTarget.id)) {
            return [...prev, deleteTarget.id];
          }
          return prev;
        });
        onDeleteChapter?.(deleteTarget.id);
      }
    }

    setSections(updated);
    onSectionsChange(updated);

    setConfirmDelete(false);
    setDeleteTarget(null);
  };

  const cancelDeleteAction = () => {
    setConfirmDelete(false);
    setDeleteTarget(null);
  };

  const handleEditLecture = (sectionIndex, lectureIndex) => {
    const lesson = sections[sectionIndex].lessons[lectureIndex];

    // Set editLecture with existing data, including the id
    setEditLectureIndex({ section: sectionIndex, lecture: lectureIndex });
    setEditLecture({
      id: lesson.id, // Make sure the id is preserved
      title: lesson.title,
      description: lesson.description,
      video: lesson.video,
      isActive: lesson.preview,
    });
  };

  const handleSaveLecture = () => {
    const updatedSections = [...sections]; // Create a copy of sections
    const currentLecture =
      updatedSections[editLectureIndex.section].lessons[
      editLectureIndex.lecture
      ];

    // Ensure the currentLecture exists and has a valid id
    if (currentLecture.id) {
      // Update the existing lecture with the new values, including preview (isActive)
      updatedSections[editLectureIndex.section].lessons[
        editLectureIndex.lecture
      ] = {
        ...currentLecture, // Keep the existing data
        ...editLecture, // Overwrite with the edited fields (including preview)
        preview: editLecture.isActive,
      };
    } else {
      // If there's no ID (new lecture), create a new lecture
      const newLecture = {
        ...editLecture,
        chapter: { id: updatedSections[editLectureIndex.section].id },
        preview: editLecture.isActive,
      };

      updatedSections[editLectureIndex.section].lessons.push(newLecture);
    }

    setSections(updatedSections); // Update the sections state with the modified data
    onSectionsChange(updatedSections); // Notify the parent component of the changes

    // Reset the edit state after saving
    setEditLectureIndex({ section: null, lecture: null });
    setEditLecture({
      title: "",
      description: "",
      video: null,
      isActive: false,
    }); // Reset the form fields
  };

  const handleEditSection = (sectionIndex) => {
    setEditSectionIndex(sectionIndex);
    setEditSectionTitle(sections[sectionIndex].title);
  };

  const handleSaveSection = () => {
    if (!editSectionTitle.trim()) return;

    const updatedSections = [...sections];
    updatedSections[editSectionIndex].title = editSectionTitle;

    // Pass updated state to parent
    onSectionsChange(updatedSections);

    // Reset edit state
    setEditSectionIndex(null);
    setEditSectionTitle("");
  };

  const handleCancelSectionEdit = () => {
    setEditSectionIndex(null);
    setEditSectionTitle("");
  };

  const toggleVideoPreview = (sectionIndex, lectureIndex) => {
    setVideoPreviewEnabled((prevState) => ({
      ...prevState,
      [`${sectionIndex}-${lectureIndex}`]:
        !prevState[`${sectionIndex}-${lectureIndex}`],
    }));
  };

  const toggleAddLectureForm = (sectionIndex) => {
    setShowAddLectureForm((prevState) => ({
      ...prevState,
      [sectionIndex]: !prevState[sectionIndex],
    }));
  };

  const handleCancelEdit = () => {
    setEditLectureIndex({ section: null, lecture: null });
    setEditLecture({ title: "", video: null });
  };

  const handlePreviewChange = (e, sectionId, lectureId) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedLessons = section.lessons.map((lesson) => {
          if (lesson.id === lectureId) {
            return { ...lesson, preview: e.target.checked }; // Cập nhật trạng thái preview
          }
          return lesson;
        });
        return { ...section, lessons: updatedLessons };
      }
      return section;
    });

    setSections(updatedSections);
  };

  return (
    <div className="mt-8 relative">
      <label className="font-semibold text-lg text-gray-800">
        Course Content
      </label>
      <div className="flex gap-2 mt-2">
        <input
          value={newSectionTitle || ""}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="Chapter title..."
          className="p-3 border border-black rounded-lg bg-while flex-1"
        />
        <button
          onClick={handleAddSection}
          className="flex items-center bg-white gap-1 px-3 py-2 border border-black text-black-100 rounded-lg hover:bg-green-500 hover:border-red-700 transition"
        >
          <FiPlusCircle />
        </button>
      </div>

      <div className="space-y-6 mt-6">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border rounded-xl bg-white shadow">
            <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
              {editSectionIndex === sectionIndex ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editSectionTitle}
                    onChange={(e) => setEditSectionTitle(e.target.value)}
                    className="p-2 border rounded-lg flex-1"
                  />
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={handleSaveSection}
                      className="flex items-center gap-1 px-3 py-2 border text-green-600 border-green-600 hover:text-black rounded-lg hover:bg-green-500 transition"
                    >
                      <FiSave size={18} />
                    </button>
                    <button
                      onClick={handleCancelSectionEdit}
                      className="flex items-center gap-1 px-3 py-2 border border-red-600 text-red-600 rounded-lg hover:text-black hover:bg-red-500 transition"
                    >
                      <FiXCircle size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <button
                    onClick={() => handleToggleSection(sectionIndex)}
                    className="flex-1 text-left font-semibold text-gray-800"
                  >
                    {section.title}
                  </button>
                  <div className="cursor-pointer flex gap-2">
                    <button
                      onClick={() => handleEditSection(sectionIndex)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(sectionIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                    {expandedIndex === sectionIndex ? (
                      <FiChevronUp
                        onClick={() => handleToggleSection(sectionIndex)}
                      />
                    ) : (
                      <FiChevronDown
                        onClick={() => handleToggleSection(sectionIndex)}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {expandedIndex === sectionIndex && (
              <div className="p-4 bg-white space-y-6">
                <button
                  onClick={() => toggleAddLectureForm(sectionIndex)}
                  className="text-sm mb-2 text-blue-600 hover:text-blue-800"
                >
                  {showAddLectureForm[sectionIndex]
                    ? "Ẩn thêm bài giảng"
                    : "➕ Thêm bài giảng"}
                </button>

                {showAddLectureForm[sectionIndex] && (
                  <div className="space-y-3 border border-dashed border-black p-4 rounded-lg bg-blue-50">
                    <input
                      type="text"
                      placeholder="Lecture Title"
                      value={newLecture.title}
                      onChange={(e) =>
                        setNewLecture({ ...newLecture, title: e.target.value })
                      }
                      className="w-full p-3 border border-black rounded "
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={newLecture.description}
                      onChange={(e) =>
                        setNewLecture({
                          ...newLecture,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-black rounded overflow-auto "
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm">Preview :</span>
                      <ToggleSwitch
                        checked={newLecture.isActive}
                        onChange={() =>
                          setNewLecture((prev) => ({
                            ...prev,
                            isActive: !prev.isActive,
                          }))
                        }
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor={`file-upload-${sectionIndex}`}
                        className="cursor-pointer flex items-center bg-white px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-500 hover:text-black transition"
                      >
                        <FiVideo className="mr-2" />
                        Choose Video
                      </label>
                      <input
                        id={`file-upload-${sectionIndex}`}
                        type="file"
                        accept=".mp4,.avi,.mkv"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file && file.size > 3 * 1024 * 1024 * 1024) {
                            setLectureError("❌ Video file must be less than or equal to 3GB.");
                            setNewLecture({ ...newLecture, video: null });
                          } else {
                            setLectureError("");
                            setNewLecture({ ...newLecture, video: file });
                          }
                        }}
                        className="hidden"
                      />
                      {newLecture.video && (
                        <p className="text-sm text-green-700">
                          🎞️ {newLecture.video.name}
                        </p>
                      )}
                    </div>
                    {lectureError && (
                      <p className="text-sm text-red-500">{lectureError}</p>
                    )}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleAddLecture(sectionIndex)}
                        className="flex items-center bg-white gap-1 px-3 py-2 border border-green-600 text-green-600 hover:text-black rounded-lg hover:bg-green-500 transition"
                      >
                        <FiPlusCircle />
                      </button>
                    </div>
                  </div>
                )}

                {section.lessons.map((lesson, lectureIndex) => (
                  <div
                    key={lectureIndex}
                    className="border p-4 rounded bg-white shadow mb-4"
                  >
                    {editLectureIndex.section === sectionIndex &&
                      editLectureIndex.lecture === lectureIndex ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editLecture.title}
                          onChange={(e) =>
                            setEditLecture({
                              ...editLecture,
                              title: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                        <textarea
                          value={editLecture.description || ""}
                          onChange={(e) =>
                            setEditLecture((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Description"
                          className="w-full p-2 border rounded"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm">Preview :</span>
                          <ToggleSwitch
                            checked={editLecture.isActive} // Reflects the preview state (true/false)
                            onChange={() =>
                              setEditLecture((prev) => ({
                                ...prev,
                                isActive: !prev.isActive, // Toggle the preview state
                              }))
                            }
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <label
                            htmlFor={`file-upload-edit-${sectionIndex}-${lectureIndex}`}
                            className="cursor-pointer flex items-center bg-white px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-500 hover:text-black transition"
                          >
                            <FiVideo className="mr-2" />
                            Choose Video
                          </label>
                          <input
                            id={`file-upload-edit-${sectionIndex}-${lectureIndex}`}
                            type="file"
                            accept=".mp4,.avi,.mkv"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file && file.size > 3 * 1024 * 1024 * 1024) {
                                setLectureError("Video file must be less than or equal to 3GB.");
                                setEditLecture((prev) => ({ ...prev, video: null }));
                              } else {
                                setLectureError("");
                                setEditLecture((prev) => ({ ...prev, video: file }));
                              }
                            }}
                            className="hidden"
                          />
                          {editLecture.video && (
                            <p className="text-sm text-green-700">
                              🎞️ {editLecture.video.name}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end gap-2 mt-2 ">
                          <button
                            onClick={handleSaveLecture}
                            className="flex items-center gap-1 px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-300 transition"
                          >
                            <FiSave size={18} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-2 border border-red-600 text-red-600 rounded-lg  hover:bg-red-300 transition"
                          >
                            <FiX size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800 truncate">
                              {lesson.title}
                            </p>
                            {lesson.description && (
                              <p className="text-sm text-gray-600 italic overflow-auto max-h-12 ">
                                {lesson.description}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              {lesson.preview
                                ? "Preview Enabled"
                                : "Preview Disabled"}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                toggleVideoPreview(sectionIndex, lectureIndex)
                              }
                              className="text-gray-600 hover:text-gray-800"
                            >
                              {videoPreviewEnabled[
                                `${sectionIndex}-${lectureIndex}`
                              ] ? (
                                <FiEye size={18} />
                              ) : (
                                <FiEyeOff size={18} />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleEditLecture(sectionIndex, lectureIndex)
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteLecture(sectionIndex, lectureIndex)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                        {videoPreviewEnabled[
                          `${sectionIndex}-${lectureIndex}`
                        ] && (
                            <video
                              controls
                              className="w-full mt-2 rounded shadow"
                              src={
                                lesson.video instanceof File
                                  ? URL.createObjectURL(lesson.video) // Ưu tiên video mới upload
                                  : lesson.videoUrl // Nếu không có thì dùng video từ server
                              }
                            />
                          )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                Bạn có chắc chắn muốn xóa?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelDeleteAction}
                  className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteAction}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseEditModalSection;
