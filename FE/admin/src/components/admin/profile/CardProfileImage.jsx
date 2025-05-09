import React from "react";
import { uploadAvatarActionAsync, uploadBackgroundActionAsync } from "../../../redux/reducer/auth/authReducer";

const CardProfileImage = ({userInfo}) => {
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    const userId = userInfo?.id;
    if (file && userId) {
      dispatch(uploadAvatarActionAsync(file, userId));
    }
  };
  const handleBackgroundUpload = (e) => {
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
        <img
          src={`http://localhost:8080/storage/background/${userInfo?.id}/${userInfo?.background}`}
          alt="background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
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
            src={`http://localhost:8080/storage/avatar/${userInfo?.id}/${userInfo?.avatar}`}
            className="rounded-circle border border-white"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
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
        </div>
      </div>
    </>
  );
};

export default CardProfileImage;
