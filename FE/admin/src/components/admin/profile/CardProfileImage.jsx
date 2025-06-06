import React from "react";
import { useDispatch } from "react-redux";
import avatar from "../../../assets/images/avatar.png";
import {
  uploadAvatarActionAsync,
  uploadBackgroundActionAsync,
} from "../../../redux/reducer/auth/authReducer";
import { VITE_AVATAR_URL, VITE_BACKGROUND_URL } from "../../../setting/api";
const CardProfileImage = ({ userInfo, editable = true }) => {
  const dispatch = useDispatch();
  const handleAvatarUpload = (e) => {
    if (!editable) return;
    const file = e.target.files[0];
    const userId = userInfo?.id;
    if (file && userId) {
      dispatch(uploadAvatarActionAsync(file, userId));
    }
  };

  const handleBackgroundUpload = (e) => {
    if (!editable) return;
    const file = e.target.files[0];
    const userId = userInfo?.id;
    if (file && userId) {
      dispatch(uploadBackgroundActionAsync(file, userId));
    }
  };
  return (
    <>
      {/* Background Image with overlay */}
      <div
        className="position-relative"
        style={{ height: "200px", overflow: "hidden", width: "100%" }}
      >
        {userInfo?.background ? (
          <img
            src={`${VITE_BACKGROUND_URL}/${userInfo?.id}/${userInfo?.background}`}
            alt="background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#ccc",
              display: "block",
            }}
          />
        )}
        {editable && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              color: "#fff",
              opacity: 0,
              transition: "0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
          >
            <span>Thay đổi background</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </div>
        )}
      </div>

      {/* Avatar Image with overlay */}
      <div
        className="d-flex justify-content-center position-relative"
        style={{ marginTop: "-75px" }} // kéo avatar lên gần background
      >
        <div
          className="position-relative"
          style={{ width: "150px", height: "150px" }}
        >
          <img
            alt="avatar"
            src={
              userInfo?.avatar
                ? `${VITE_AVATAR_URL}/${userInfo?.id}/${userInfo?.avatar}`
                : avatar
            }
            className="rounded-circle border border-white"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {editable && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                color: "#fff",
                opacity: 0,
                transition: "0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
            >
              <span>Thay đổi avatar</span>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CardProfileImage;
