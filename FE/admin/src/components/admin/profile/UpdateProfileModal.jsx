// src/components/UpdateProfileModal.jsx
import { Button, Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProfileActionAsync } from "../../../redux/reducer/auth/authReducer";

const UpdateProfileModal = ({ open, onClose, userInfo }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleFinish = (values) => {
    const updatedValues = { ...values };
    updatedValues.id = userInfo.id;
    Modal.confirm({
      title: "Confirm Update",
      content:
        "Are you sure you want to save the changes to your personal information?",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk() {
        dispatch(updateProfileActionAsync(updatedValues));
        onClose();
      },
    });
  };
  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        fullName: userInfo.fullName,
        email: userInfo.email,
        address: userInfo.address,
        phone: userInfo.phone,
        bio: userInfo.bio,
      });
    }
  }, [userInfo, form]);
  return (
    <Modal
      title="Cập nhật thông tin cá nhân"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item label="Full Name" name="fullName" rules={[{required: true , message: "Cannot be left blank"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" >
          <Input disabled />
        </Form.Item>
        <Form.Item label="Address" name="address" rules={[{required: true , message: "Cannot be left blank"}]} >
          <Input />
        </Form.Item>
        <Form.Item label="Phone Number" name="phone" rules={[{required: true , message: "Cannot be left blank"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="Bio" name="bio" rules={[{required: true , message: "Cannot be left blank"}]}>
          <Input />
        </Form.Item>

        <Form.Item className="text-end">
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProfileModal;
