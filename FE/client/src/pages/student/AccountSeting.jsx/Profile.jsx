import { useEffect, useRef, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { useAuth } from "../../../contexts/AuthContext";
import { getUser } from "../../../services/ProfileServices/MyProfile.services";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import defaultBackground from "../../../assets/images/bg-default.png";

const Profile = () => {
  const { user, handleUpdateAvatar, handleUpdateBackground, handleUpdateUser } =
    useAuth();
  const [avatar, setAvatar] = useState(
    `${import.meta.env.VITE_AVATAR_URL}/${user?.id}/${user?.avatar}`
  );
  const [background, setBackground] = useState(
    `${import.meta.env.VITE_BACKGROUND_URL}/${user.id}/${user.background}`
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    email: "",
    address: "",
    phone: "",
  });

  const bioRef = useRef(null); // Tham chiếu đến textarea

  // Hàm gọi API getUser để lấy thông tin người dùng khi component load
  useEffect(() => {
    if (user && user.id) {
      const fetchUserData = async () => {
        const userData = await getUser(user.id); // Gọi API getUser để lấy thông tin người dùng
        if (userData) {
          setFormData({
            fullName: userData.fullName || "",
            bio: userData.bio || "",
            email: userData.email || "",
            address: userData.address || "",
            phone: userData.phone || "",
          });
          setAvatar(
            `${import.meta.env.VITE_AVATAR_URL}/${user.id}/${userData.avatar}`
          );
          setBackground(
            `${import.meta.env.VITE_BACKGROUND_URL}/${user.id}/${userData.background
            }`
          );
        }
      };

      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    // Cập nhật chiều cao của textarea mỗi khi bio thay đổi
    if (bioRef.current) {
      bioRef.current.style.height = "auto"; // Đặt chiều cao về auto trước khi thay đổi
      bioRef.current.style.height = `${bioRef.current.scrollHeight}px`; // Cập nhật chiều cao theo nội dung
    }
  }, [formData.bio]); // Mỗi khi formData.bio thay đổi, thực hiện điều chỉnh chiều cao

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 20);
      setFormData({ ...formData, phone: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    await handleUpdateAvatar(file);
  };

  const handleUploadBackground = async (file) => {
    await handleUpdateBackground(file);
  };

  const onSubmit = async () => {
    setIsSaving(true);
    handleUpdateUser(formData);
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
          <img
            src={background}
            alt="Background"
            className="w-full h-72 object-cover"
            onError={(e) => {
              e.target.src = defaultBackground;
            }}
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
            <Avatar className="w-32 h-32 border-4 border-red-100 shadow-lg">
              <AvatarImage src={avatar} alt="Avatar" className="object-cover" />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
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
          <div className="ml-6 flex-1">
            <div className="flex items-center justify-between">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`text-2xl font-bold py-2 focus:outline-none bg-transparent transition-all
    ${isEditing ? "border-b-2 border-red-200" : "border-b border-transparent"}`}
              />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-gray-300 rounded-full shadow-lg hover:bg-red-200 transition-colors"
              >
                <CiEdit className="text-xl text-gray-700" />
              </button>
            </div>
            <textarea
              ref={bioRef}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className={`text-sm text-gray-600 py-2 focus:outline-none bg-transparent mt-2 w-4/5 resize-none min-h-[50px] max-h-[80px] overflow-y-auto
                        ${isEditing ? "border-b-2 border-red-200" : "border-none"}`}
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
                className="w-full focus:outline-none border-none rounded-sm bg-transparent py-2 focus:border-red-200 transition-colors"
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
                className={`w-full focus:outline-none bg-transparent py-2 transition-colors ${isEditing ? "border-b-2 border-red-200" : "border-none"
                  }`}
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
                maxLength={20}
                pattern="\d*"
                inputMode="numeric"
                className={`w-full focus:outline-none bg-transparent py-2 transition-colors ${isEditing ? "border-b-2 border-red-200" : "border-none"
                  }`}
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
