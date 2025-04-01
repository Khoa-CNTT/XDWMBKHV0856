import React, { useState, useRef } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Tran Duy Long",
    email: "tranduylong0201@gmail.com",
    bio: "Experienced teacher with a passion for online education.",
    expertise: "Web Development, JavaScript, React",
    avatar: null, // URL của ảnh đại diện
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated profile to your backend
    console.log("Updated profile:", profile);
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setProfile({ ...profile, avatar: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Teacher Profile
      </h1>
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="avatar"
            >
              Profile Picture
            </label>
            <div className="flex items-center">
              {profile.avatar && (
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full mr-4 object-cover"
                />
              )}
              <input
                type="file"
                id="avatar"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded mr-2"
              >
                Upload Image
              </button>
              {profile.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary"
              id="name"
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary"
              id="email"
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary"
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="expertise"
            >
              Expertise
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary"
              id="expertise"
              type="text"
              name="expertise"
              value={profile.expertise}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Changes
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4 flex justify-center">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-4xl">
                  {profile.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Name</h2>
            <p className="text-gray-600">{profile.name}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Email</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Bio</h2>
            <p className="text-gray-600">{profile.bio}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Expertise
            </h2>
            <p className="text-gray-600">{profile.expertise}</p>
          </div>
          <button
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
