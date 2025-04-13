import { useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import {
  updateAvatar,
  updateUser,
  uploadBackground,
} from "../../../services/ProfileServices/MyProfile.services";
import { useAuth } from "../../../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(
    `${import.meta.env.VITE_AVATAR_URL}/${user.id}/${user.avatar}` ||
      "default-avatar.jpg"
  );
  const [background, setBackground] = useState(
    `${import.meta.env.VITE_BACKGROUND_URL}/${user.id}/${user.background}` ||
      "default-bg.jpg"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName || "Updating...",
    bio: user.bio || "Updating...",
    email: user.email || "Updating...",
    address: user.address || "Updating...",
    phone: user.phone || "Updating...",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      handleUploadAvatar(file);
    }
  };

  const handleBackgroundChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackground(reader.result);
      };
      reader.readAsDataURL(file);
      handleUploadBackground(file);
    }
  };

  const handleUploadAvatar = async (file) => {
    await updateAvatar(file, user.id);
  };

  const handleUploadBackground = async (file) => {
    await uploadBackground(file, user.id);
  };

  const onSubmit = async () => {
    setIsSaving(true);
    const updatedUser = await updateUser(formData, user.id);
    console.log("Updated user from API:", updatedUser);
    setIsSaving(false);
    setIsEditing(false);
  };

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return `${name[0]}****@${domain}`;
  };

  if (!user) return <div>Error loading profile</div>;

  return (
    <div className="mt-5">
      <div className="max-w-[950px] bg-white rounded-lg shadow overflow-hidden">
        <div className="relative">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute right-4 top-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <CiEdit className="text-xl text-gray-700" />
          </button>
          <img
            src={background}
            alt="Background"
            className="w-full h-72 object-cover"
          />
          {isEditing && (
            <label className="absolute right-4 bottom-4 bg-black bg-opacity-50 p-2 rounded-full cursor-pointer hover:bg-opacity-70 transition-all">
              <AiOutlineCamera className="text-white text-2xl" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleBackgroundChange}
              />
            </label>
          )}
        </div>
        <div className="px-8 flex">
          <div className="relative -top-16">
            <img
              src={avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-red-100 shadow-lg object-cover"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-black bg-opacity-50 p-2 rounded-full cursor-pointer hover:bg-opacity-70 transition-all">
                <AiOutlineCamera className="text-white text-xl" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>
          <div className="ml-6 flex flex-col justify-start">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-2xl font-bold py-2 focus:outline-none bg-transparent border-none"
            />
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-sm text-gray-600 py-2 focus:outline-none border-none bg-transparent mt-1"
            />
          </div>
        </div>
        <form
          className="px-8 pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={maskEmail(formData.email)}
                disabled
                className="w-full focus:outline-none border-none rounded-sm bg-transparent py-2 focus:border-red-500 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full focus:outline-none border-none rounded-sm bg-transparent py-2 focus:border-red-500 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full focus:outline-none border-none rounded-sm bg-transparent py-2 focus:border-red-500 transition-colors"
              />
            </div>
          </div>
          {isEditing && !isSaving && (
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
