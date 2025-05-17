import { Button, Card, Form, Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ActivityLogs from "../../components/admin/profile/ActivityLogs";
import CardProfileImage from "../../components/admin/profile/CardProfileImage";
import ChangePasswordModal from "../../components/admin/profile/ChangePasswordModal";
import UpdateProfileModal from "../../components/admin/profile/UpdateProfileModal";
import { formatDateTime } from "../../utils/formatDateTime";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.authReducer) || {};
  const [passwordForm] = Form.useForm();
  const onClose = () => {
    setIsPasswordModalOpen(false);
    passwordForm.resetFields();
  };
  const [openModal, setOpenModal] = useState(false);
  if (userInfo === undefined)
    return (
      <div>
        <Spin />
      </div>
    );
  //Modal thay đổi mật khẩu
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="container mt-3">
      <div className="row justify-content-center" >
        {/* Profile Card */}
        <div className="col-md-6 ">
          <Card hoverable cover={<CardProfileImage userInfo={userInfo} editable={true}/>}>
            <h2 className="text-center">{userInfo?.fullName || "User Name"}</h2>
            <p className="text-center text-muted">
              {userInfo?.email || "User Email"}
            </p>
            <p className="text-center text-muted">
              {userInfo?.role || "User Role"}
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
              <Button type="primary" onClick={() => setOpenModal(true)}>
                Update Information
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </Card>
        </div>

        {/* Additional User Info */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <Card title="Thông tin chi tiết" className="w-100">
            <div className="d-flex justify-content-between mb-2">
              <strong>Address:</strong>
              <span>{userInfo?.address || "Not available"}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <strong>Phone:</strong>
              <span>{userInfo?.phone || "Not available"}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <strong>Join date:</strong>
              {userInfo?.createdAt
                ? formatDateTime(userInfo.createdAt)
                : "Not available"}
            </div>
            <div className="d-flex justify-content-between mb-2">
              <strong>Bio:</strong>
              <span>{userInfo?.bio || "Not available"}</span>
            </div>
          </Card>
        </div>
      </div>
      {userInfo?.id && <ActivityLogs userId={userInfo.id} />}
      {openModal && (
        <UpdateProfileModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          userInfo={userInfo}
        />
      )}
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={onClose}
        userInfo={userInfo}
        passwordForm={passwordForm}
      />
    </div>
  );
};

export default Profile;
