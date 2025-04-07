import { BookOutlined, CheckOutlined, DeleteOutlined, DollarOutlined, EditOutlined, EyeOutlined, FileTextOutlined, HomeOutlined, MailOutlined, PhoneOutlined, TagOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCourseActionAsync, updateCourseActionAsync } from "../../redux/reducer/admin/courseReducer";
import { deleteUserActionAsync, updateUserActionAsync } from "../../redux/reducer/admin/userReducer";

const { Option } = Select;
const ActionButtons = ({ type, record }) => {
  const [selectedField, setSelectedField] = useState([]);
  // State để quản lý trạng thái mở/đóng của modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State để lưu loại modal (Edit hoặc Delete)
  const [modalAction, setModalAction] = useState("");
  // Khởi tạo form từ Ant Design
  const [form] = Form.useForm();

  const dispatch = useDispatch()

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
          title: "Xác nhận cập nhật",
          content: "Bạn có chắc chắn muốn thay đổi thông tin không?",
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: async () => {
            if (type === "User") {
              await dispatch(updateUserActionAsync(values));
            } else if (type === "Course") {
              await dispatch(updateCourseActionAsync(values))
            }
            setIsModalOpen(false);
          },
        });
      } else if (modalAction === "Delete") {
        if (type === "User") {
          await dispatch(deleteUserActionAsync(record.id));
        } else if (type === "Course") {
          await dispatch(deleteCourseActionAsync(record.id))
        }
        setIsModalOpen(false);
      }
      else if (modalAction == "Approve") {
        console.log("Duyệt thành công")
      }
      else {
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
        return <p>Bạn có chắc chắn muốn xóa người dùng "{record.fullName} không ?"</p>

      case "Course":
        return <p>Bạn có chắc chắn muốn xóa "{record.title}" không?</p>;
      default:
        return null;
    }
  };

  const renderFormApprove = () => {
    if (type === "Course") {
      return <p>Bạn có chắc chắn muốn duyệt "{record.title}" không?</p>
    }
  }
  // Hàm hiển thị nội dung modal Edit tùy theo loại dữ liệu
  const renderFormEdit = () => {
    switch (type) {
      case "User":
        return (
          <>
            <Form.Item name="id">
              <Input addonBefore={<UserOutlined />} value={record.id || "N/A"} disabled />
            </Form.Item>

            <Form.Item name="email" rules={[{ required: true, message: "Email is required!" }]}>
              <Input addonBefore={<MailOutlined />} placeholder="Email" disabled />
            </Form.Item>

            <Form.Item name="fullName" rules={[{ required: true, message: "Full Name is required!" }]}>
              <Input addonBefore={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>

            <Form.Item name="address" rules={[{ required: true, message: "Address is required!" }]}>
              <Input addonBefore={<HomeOutlined />} placeholder="Address" />
            </Form.Item>

            <Form.Item name="phone" rules={[{ required: true, message: "Phone is required!" }]}>
              <Input addonBefore={<PhoneOutlined />} placeholder="Phone" />
            </Form.Item>

            <Form.Item name="role" rules={[{ required: true, message: "Role is required!" }]}>
              <Select placeholder="Select a role">
                <Option value="INSTRUCTOR">INSTRUCTOR</Option>
                <Option value="STUDENT">STUDENT</Option>
                <Option value="ADMIN">ADMIN</Option>
              </Select>
            </Form.Item>
          </>

        );
      default:
        return null;
    }
  };

  const renderFormView = () => {
    switch (type) {
      case "User":
        return (
          <>
            <Form.Item name="id">
              <Input addonBefore={<UserOutlined />} value={record.id || "N/A"} readOnly />
            </Form.Item>

            <Form.Item name="email">
              <Input addonBefore={<MailOutlined />} value={record.email || "N/A"} readOnly />
            </Form.Item>

            <Form.Item name="fullName">
              <Input addonBefore={<UserOutlined />} value={record.fullName || "N/A"} readOnly />
            </Form.Item>

            <Form.Item name="address">
              <Input addonBefore={<HomeOutlined />} value={record.address || "N/A"} readOnly />
            </Form.Item>

            <Form.Item name="phone">
              <Input addonBefore={<PhoneOutlined />} value={record.phone || "N/A"} readOnly />
            </Form.Item>

            <Form.Item name="role">
              <Input addonBefore={<TagOutlined />} value={record.role || "N/A"} readOnly />
            </Form.Item>
          </>

        );
      case "Course":
        return (
          <>
            <Form.Item name="id">
              <Input addonBefore={<BookOutlined />} readOnly />
            </Form.Item>

            <Form.Item name="description" >
              <Input addonBefore={<FileTextOutlined />} placeholder="Description" readOnly />
            </Form.Item>

            <Form.Item name="price" >
              <Input addonBefore={<DollarOutlined />} type="number" placeholder="Price" readOnly />
            </Form.Item>

            <Form.Item name={["owner", "email"]}>
              <Input addonBefore={<UserOutlined />} readOnly />
            </Form.Item>

            <Form.Item>
              <Input
                addonBefore={<FileTextOutlined />}
                value={record.fields?.map(field => field.name).join(", ") || "N/A"}
                readOnly
              />
            </Form.Item>

            <Form.Item>
              <Input
                addonBefore={<ToolOutlined />}
                value={record.skills?.map(skill => skill.name).join(", ") || "N/A"}
                readOnly
              />
            </Form.Item>

            <Form.Item name="status" rules={[{ required: true }]}>
              <Select placeholder="Select status" disabled>
                <Option value="PENDING">PENDING</Option>
                <Option value="INACTIVE">INACTIVE</Option>
              </Select>
            </Form.Item>
          </>

        );
      default:
        return null;
    }
  }
  let buttons;

  if (type === "User") {
    buttons = (
      <>
        <Button
          type="text"
          icon={<EyeOutlined />}
          style={{ color: "green" }}
          className="custom-btn"
          onClick={() => showModal("View")}
        />
        <Button
          type="text"
          icon={<EditOutlined />}
          style={{ color: "gold" }}
          className="custom-btn"
          onClick={() => showModal("Edit")}
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          className="custom-btn"
          danger
          onClick={() => showModal("Delete")}
        />
      </>
    );
  } else if (type === "Course") {
    buttons = (
      <>
        <Button
          type="text"
          icon={<EyeOutlined />}
          style={{ color: "green" }}
          className="custom-btn"
          onClick={() => showModal("View")}
        />
        <Button
          type="text"
          icon={<CheckOutlined />}
          style={{ color: "blue" }}
          className="custom-btn"
          onClick={() => showModal("Approve")}
        >
        </Button>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          className="custom-btn"
          danger
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
        title={`${modalAction} ${type}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
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