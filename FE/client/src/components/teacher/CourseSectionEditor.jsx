import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  FileVideo,
  Eye,
  EyeOff,
  PlusCircle,
  Save,
  XCircle,
  X,
} from "lucide-react";

const CourseSectionEditor = ({
  sections,
  setSections,
  expandedIndex,
  setExpandedIndex,
}) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newLecture, setNewLecture] = useState({ title: "", video: null });
  const [editLectureIndex, setEditLectureIndex] = useState({
    section: null,
    lecture: null,
  });
  const [editLecture, setEditLecture] = useState({ title: "", video: null });
  const [editSectionIndex, setEditSectionIndex] = useState(null);
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [videoPreviewEnabled, setVideoPreviewEnabled] = useState({});

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    setSections([...sections, { title: newSectionTitle, lessons: [] }]);
    setNewSectionTitle("");
  };

  const handleToggleSection = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleAddLecture = (sectionIndex) => {
    if (!newLecture.title || !newLecture.video) return;
    const updated = [...sections];
    updated[sectionIndex].lessons.push({
      title: newLecture.title,
      video: newLecture.video,
    });
    setSections(updated);
    setNewLecture({ title: "", video: null });
  };

  const handleDeleteLecture = (sectionIndex, lectureIndex) => {
    const updated = [...sections];
    updated[sectionIndex].lessons.splice(lectureIndex, 1);
    setSections(updated);
  };

  const handleEditLecture = (sectionIndex, lectureIndex) => {
    const lesson = sections[sectionIndex].lessons[lectureIndex];
    setEditLectureIndex({ section: sectionIndex, lecture: lectureIndex });
    setEditLecture({ title: lesson.title, video: lesson.video });
  };

  const handleSaveLecture = () => {
    const updated = [...sections];
    updated[editLectureIndex.section].lessons[editLectureIndex.lecture] = {
      ...editLecture,
    };
    setSections(updated);
    setEditLectureIndex({ section: null, lecture: null });
    setEditLecture({ title: "", video: null });
  };

  const handleCancelEdit = () => {
    setEditLectureIndex({ section: null, lecture: null });
    setEditLecture({ title: "", video: null });
  };

  const handleEditSection = (sectionIndex) => {
    setEditSectionIndex(sectionIndex);
    setEditSectionTitle(sections[sectionIndex].title);
  };

  const handleSaveSection = () => {
    if (!editSectionTitle.trim()) return;
    const updated = [...sections];
    updated[editSectionIndex].title = editSectionTitle;
    setSections(updated);
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

  return (
    <div className="mt-8">
      <label className="font-semibold text-lg text-gray-800">
        Course Content
      </label>
      <div className="flex gap-2 mt-2">
        <input
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="Chapter title..."
          className="p-3 border border-red-500 rounded-lg bg-red-50 flex-1"
        />
        <button
          onClick={handleAddSection}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <PlusCircle />
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
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <Save />
                    </button>
                    <button
                      onClick={handleCancelSectionEdit}
                      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg"
                    >
                      <XCircle />
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
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        const updated = [...sections];
                        updated.splice(sectionIndex, 1);
                        setSections(updated);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                    {expandedIndex === sectionIndex ? (
                      <ChevronUp
                        onClick={() => handleToggleSection(sectionIndex)}
                      />
                    ) : (
                      <ChevronDown
                        onClick={() => handleToggleSection(sectionIndex)}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {expandedIndex === sectionIndex && (
              <div className="p-4 bg-gray-50 space-y-6">
                {/* Add Lecture */}
                <div className="space-y-3 border border-dashed border-green-500 p-4 rounded-lg bg-green-50">
                  <input
                    type="text"
                    placeholder="Lecture Title"
                    value={newLecture.title}
                    onChange={(e) =>
                      setNewLecture({ ...newLecture, title: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor={`file-upload-${sectionIndex}`}
                      className="cursor-pointer flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      <FileVideo size={18} className="mr-2" />
                      Choose Video
                    </label>
                    <input
                      id={`file-upload-${sectionIndex}`}
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        setNewLecture({
                          ...newLecture,
                          video: e.target.files[0],
                        })
                      }
                      className="hidden"
                    />
                    {newLecture.video && (
                      <p className="text-sm text-green-700">
                        🎞️ {newLecture.video.name}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleAddLecture(sectionIndex)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <PlusCircle />
                    </button>
                  </div>
                </div>

                {/* List Lectures */}
                {section.lessons.map((lesson, lectureIndex) => {
                  const isEditing =
                    editLectureIndex.section === sectionIndex &&
                    editLectureIndex.lecture === lectureIndex;

                  return (
                    <div
                      key={lectureIndex}
                      className="border p-4 rounded bg-white shadow mb-4"
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={editLecture.title}
                            onChange={(e) =>
                              setEditLecture({
                                ...editLecture,
                                title: e.target.value,
                              })
                            }
                            className="p-2 border rounded w-full mb-2"
                          />
                          <div className="flex gap-2 items-center">
                            <label
                              htmlFor={`edit-file-${sectionIndex}-${lectureIndex}`}
                              className="cursor-pointer flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                              <FileVideo size={18} className="mr-2" />
                              Choose Video
                            </label>
                            <input
                              id={`edit-file-${sectionIndex}-${lectureIndex}`}
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                setEditLecture({
                                  ...editLecture,
                                  video: e.target.files[0],
                                })
                              }
                              className="hidden"
                            />
                            {editLecture.video && (
                              <p className="text-sm text-green-700">
                                🎞️ {editLecture.video.name}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={handleSaveLecture}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                              <Save />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg"
                            >
                              <XCircle />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{lesson.title}</p>
                              <p className="text-sm text-gray-500">
                                🎞️ {lesson.video?.name}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleEditLecture(sectionIndex, lectureIndex)
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteLecture(
                                    sectionIndex,
                                    lectureIndex
                                  )
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  toggleVideoPreview(sectionIndex, lectureIndex)
                                }
                                className="text-gray-500 hover:text-gray-700"
                              >
                                {videoPreviewEnabled[
                                  `${sectionIndex}-${lectureIndex}`
                                ] ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                          </div>
                          {videoPreviewEnabled[
                            `${sectionIndex}-${lectureIndex}`
                          ] &&
                            lesson.video && (
                              <video
                                controls
                                src={URL.createObjectURL(lesson.video)}
                                className="mt-2 w-full"
                              />
                            )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSectionEditor;
