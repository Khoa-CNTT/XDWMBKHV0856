import React, { useState } from "react";

const CourseAddModal = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [students, setStudents] = useState(0);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("Draft");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
    }
  };

  const handleAdd = () => {
    const newCourse = {
      id: Date.now(), // Unique ID
      title,
      price: parseFloat(price),
      descriptionout: description,
      image,
      students: parseInt(students),
      rating: parseFloat(rating),
      status,
      active: false,
      sections: [],
    };

    onAdd(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[90vw] h-[90vh] rounded-2xl shadow-xl p-8 relative overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Add New Course
        </h2>

        <div className="mb-6 space-y-4 text-lg text-gray-700">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Title</label>
            <input
              className="p-3 border rounded-lg bg-gray-50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course title..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Price</label>
            <input
              className="p-3 border rounded-lg bg-gray-50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Course price..."
              type="number"
              min="0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Description</label>
            <textarea
              className="p-3 border rounded-lg bg-gray-50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Course description..."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="h-24 w-24 object-cover rounded mt-2"
              />
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Add Course
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseAddModal;
