import { Button, Card, Form, Input, message, Modal, Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CardProfileImage from "../../components/admin/profile/CardProfileImage";
import UpdateProfileModal from "../../components/admin/profile/UpdateProfileModal";
import { http } from "../../setting/setting";
import { formatDateTime } from "../../utils/formatDateTime";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.authReducer) || {};
  const [passwordForm] = Form.useForm()
  const onClose = () => {
    setIsPasswordModalOpen(false)
    passwordForm.resetFields()
  }
  const [openModal, setOpenModal] = useState(false);
  if (userInfo === undefined)
    return (
      <div>
        <Spin />
      </div>
    );
  //Modal thay đổi mật khẩu
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const handlePasswordChange = async(values) => {
    try {
      const payload = {id: userInfo.id, password: values.password}
      const res = await http.patch(`/v1/user.password`,payload)
      if(res.status === 200){
        message.success("Change Password Success")
        setIsPasswordModalOpen(false);
      }
    } catch (error) {
      message.error(`Error: ${error.message}`)
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Profile Card */}
        <div className="col-md-6">
          <Card hoverable cover={<CardProfileImage userInfo={userInfo} />}>
            <h2 className="text-center">
              {userInfo?.fullName || "User Name"}
            </h2>
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
        <div className="col-md-6">
          <Card title="Thông tin chi tiết">
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
      {openModal && (
        <UpdateProfileModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          userInfo={userInfo}
        />
      )}
      <Modal
        title="Thay đổi mật khẩu"
        open={isPasswordModalOpen}
        onCancel={onClose}
        footer={null}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your new password!" },
              { min: 8, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
          Confirm
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
