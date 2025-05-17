import { CheckCircleFilled, DeleteFilled, EditOutlined, EyeFilled } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCouponActionAsync, updateCouponActionAsync, } from "../../redux/reducer/admin/couponReducer";
import { approveCourseActionAsync, deleteCourseActionAsync, updateCourseActionAsync, } from "../../redux/reducer/admin/courseReducer";
import { deleteUserActionAsync, updateUserActionAsync, } from "../../redux/reducer/admin/userReducer";
import { callApiLog } from "../../utils/callApiLog";
import CouponDetailForm from "./coupon/CouponDetailForm";
import CouponEditForm from "./coupon/CouponEditForm";
import CourseDetail from "./course/CourseDetail";
import UserDetailForm from "./user/UserDetailForm";
import UserEditForm from "./user/UserEditForm";

const { Option } = Select;
const { TextArea } = Input;
const ActionButtons = ({ type, record, disabled, userInfo}) => {
  // State để quản lý trạng thái mở/đóng của modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State để lưu loại modal (Edit hoặc Delete)
  const [modalAction, setModalAction] = useState("");
  // Khởi tạo form từ Ant Design
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Hàm hiển thị modal, nhận vào loại modal (Edit hoặc Delete)
  const showModal = (type) => {
    setModalAction(type);
    setIsModalOpen(true);
    form.setFieldsValue(record);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Hàm xử lý khi nhấn OK trong modal (edit vs delete)
  const handleOk = async () => {
    try {
      if (modalAction === "Edit") {
        const values = await form.validateFields(); // Chờ validate

        Modal.confirm({
          title: "Confirm Update",
          content: "Are you sure you want to update your information?",
          okText: "Confirm",
          cancelText: "Cancel",
          onOk: async () => {
            if (type === "User") {
              await dispatch(updateUserActionAsync(values));
              await callApiLog(userInfo?.id, "USER", `Update a user with id ${values.id}`);
            } else if (type === "Course") {
              await dispatch(updateCourseActionAsync(values));
              await callApiLog(userInfo?.id, "COURSE", `UPDATE a COURSE with id ${values.id}`);
            } else if (type === "Coupon") {
              await dispatch(updateCouponActionAsync(values));
              await callApiLog(userInfo?.id, "COUPON", `UPDATE a COUPON with id ${values.id}`);
            }
            setIsModalOpen(false);
          },
        });
      } else if (modalAction === "Delete") {
        if (type === "User") {
          await dispatch(deleteUserActionAsync(record.id));
          await callApiLog(userInfo?.id, "USER", `Delete a user with id ${record.id}`);
        } else if (type === "Course") {
          await dispatch(deleteCourseActionAsync(record.id));
          await callApiLog(userInfo?.id, "COURSE", `Delete a COURSE with id ${record.id}`);
        } else if (type === "Coupon") {
          await dispatch(deleteCouponActionAsync(record.id));
          await callApiLog(userInfo?.id, "COUPON", `Delete a COUPON with id ${record.id}`);
        }
        setIsModalOpen(false);
      } else if (modalAction === "Approve") {
        const values = await form.validateFields();
        const status = values.status;

        Modal.confirm({
          title: "Confirm Course Approval",
          content: `Are you sure you want to update the status to "${status}"?`,
          okText: "Confirm",
          cancelText: "Cancel",
          onOk: async () => {
            await dispatch(approveCourseActionAsync(record.id, status));
            await callApiLog(userInfo?.id, "COURSE", `Delete a COURSE with id ${record.id}`);
            setIsModalOpen(false);
          },
        });
      } else {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  // Hàm hiển thị nội dung modal Delete tùy theo loại dữ liệu
  const renderFormDelete = () => {
    switch (type) {
      case "User":
        return (
          <p>Are you sure you want to delete the user"{record.fullName}?"</p>
        );

      case "Course":
        return (
          <p>Are you sure you want to delete the course "{record.title}" </p>
        );

      case "Coupon":
        return (
          <>
            <Form.Item name="id" style={{ display: "none" }}>
              <Input />
            </Form.Item>
            <p>
              Are you sure you want to delete the coupon "{record.headCode}"{" "}
            </p>
          </>
        );

      default:
        return null;
    }
  };
  // Form Duyệt
  const renderFormApprove = () => {
    if (type === "Course") {
      return (
        <>
          <p>
            What status do you want to approve for the course "{record.title}" ?
          </p>
          <Form.Item
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status">
              <Option value="APPROVED">APPROVED</Option>
              <Option value="REJECTED">REJECTED</Option>
            </Select>
          </Form.Item>
        </>
      );
    }
  };

  // Hàm hiển thị nội dung modal Edit tùy theo loại dữ liệu
  const renderFormEdit = () => {
    switch (type) {
      case "User":
        return <UserEditForm record={record} />;
      case "Coupon":
        return <CouponEditForm record={record} />;
      default:
        return null;
    }
  };

  const renderFormView = () => {
    switch (type) {
      case "User":
        return <UserDetailForm record={record} />;
      case "Coupon":
        return <CouponDetailForm record={record} />;
      case "Course":
        return <CourseDetail id={record.id} />;
      default:
        return null;
    }
  };
  let buttons;

  if (type !== "Course") {
    buttons = (
      <>
        <Button
          type="text"
          icon={<EyeFilled />}
          style={{ color: "#00c853", fontSize: "16px" }}
          className="custom-btn"
          onClick={() => showModal("View")}
        />
        <Button
          type="text"
          icon={<EditOutlined />}
          style={{ color: "gold", fontSize: "16px" }}
          disabled={disabled}
          className="custom-btn"
          onClick={() => showModal("Edit")}
        />
        <Button
          type="text"
          disabled={disabled}
          icon={<DeleteFilled />}
          className="custom-btn"
          style={{ fontSize: "16px", color: "#e53935" }}
          onClick={() => showModal("Delete")}
        />
      </>
    );
  } else if (type === "Course") {
    buttons = (
      <>
        <Button
          type="text"
          icon={<EyeFilled />}
          style={{ color: "#00c853", fontSize: "16px" }}
          className="custom-btn"
          onClick={() => showModal("View")}
        />
        <Button
          type="text"
          icon={<CheckCircleFilled />}
          style={{ color: "	#40a9ff", fontSize: "16px" }}
          className="custom-btn"
          onClick={() => showModal("Approve")}
        ></Button>
        <Button
          type="text"
          icon={<DeleteFilled />}
          className="custom-btn"
          style={{ fontSize: "16px", color: "#e53935" }}
          onClick={() => showModal("Delete")}
        />
      </>
    );
  }

  return (
    <>
      {buttons}

      {/* Modal */}
      <Modal
        title={
          <span className="custom-modal-title">
            {modalAction} {type}
          </span>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={type === "Course" && modalAction === "View" ? 800 : undefined}
      >
        <Form form={form}>
          {modalAction === "Edit" && renderFormEdit()}
          {modalAction === "Delete" && renderFormDelete()}
          {modalAction === "View" && renderFormView()}
          {modalAction === "Approve" && renderFormApprove()}
        </Form>
      </Modal>
    </>
  );
};

export default ActionButtons;
