import { BarcodeOutlined, CheckOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FileTextOutlined, GiftOutlined, HomeOutlined, IdcardFilled, MailOutlined, MoneyCollectFilled, PhoneOutlined, TagOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCouponActionAsync, updateCouponActionAsync } from "../../redux/reducer/admin/couponReducer";
import { approveCourseActionAsync, deleteCourseActionAsync, updateCourseActionAsync } from "../../redux/reducer/admin/courseReducer";
import { deleteUserActionAsync, updateUserActionAsync } from "../../redux/reducer/admin/userReducer";
import CourseDetail from "./CourseDetail";

const { Option } = Select;
const { TextArea } = Input;
const ActionButtons = ({ type, record }) => {
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
            } else if (type === "Coupon") {
              await dispatch(updateCouponActionAsync(values))
            }
            setIsModalOpen(false);
          },
        });
      } else if (modalAction === "Delete") {
        if (type === "User") {
          await dispatch(deleteUserActionAsync(record.id));
        } else if (type === "Course") {
          await dispatch(deleteCourseActionAsync(record.id))
        } else if (type === "Coupon") {
          await dispatch(deleteCouponActionAsync(record.id))

        }
        setIsModalOpen(false);
      }
      else if (modalAction === "Approve") {
        const values = await form.validateFields();
        const status = values.status;

        Modal.confirm({
          title: "Xác nhận duyệt khóa học",
          content: `Bạn có chắc muốn cập nhật trạng thái thành "${status}" không?`,
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: async () => {
            await dispatch(approveCourseActionAsync(record.id, status));
            setIsModalOpen(false);
          }
        });
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
        return <p>Bạn có chắc chắn muốn xóa khóa học "{record.title}" không?</p>;

      case "Coupon":
        return <>
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <p>Bạn có chắc chắn muốn xóa Coupon "{record.headCode}" không?</p>
        </>

      default:
        return null;
    }
  };
  // Form Duyệt
  const renderFormApprove = () => {
    if (type === "Course") {
      return (
        <>
          <p>Bạn muốn duyệt khóa học "{record.title}" với trạng thái nào?</p>
          <Form.Item
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
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
      case "Coupon":
        return (
          <>
            <Form.Item name="id">
              <Input addonBefore={<IdcardFilled />} value={record.id || "N/A"} readOnly />
            </Form.Item>
            <Form.Item name="headCode">
              <Input addonBefore={<BarcodeOutlined />} value={record.headCode || "N/A"} />
            </Form.Item>

            <Form.Item name="description">
              <Input addonBefore={<FileTextOutlined />} rules={[{ required: true, message: "description is required!" }]} value={record.description || "N/A"} />
            </Form.Item>

            <Form.Item name="discountType">
              <Select
                className="custom-prefix-select"
                options={[
                  { value: "PERCENT", label: "%" },
                  { value: "FIXED", label: "VNĐ" },
                ]}
                placeholder="Chọn loại giảm giá"
              />
            </Form.Item>


            <Form.Item
              name="value"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị giảm giá",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const discountType = getFieldValue("discountType");
                    if (discountType === "PERCENT") {
                      if (value < 1 || value > 100) {
                        return Promise.reject("Giá trị phần trăm phải từ 1% đến 100%");
                      }
                    }
                    if (value <= 0) {
                      return Promise.reject("Giá trị phải lớn hơn 0");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input addonBefore={<MoneyCollectFilled />} />
            </Form.Item>

            <Form.Item name="dayDuration">
              <Input addonBefore={<ClockCircleOutlined />} value={record.dayDuration || "N/A"} />
            </Form.Item>
          </>
        )
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
      case "Coupon":
        return (<>
          <Form.Item name="headCode">
            <Input addonBefore={<BarcodeOutlined />} value={record.headCode || "N/A"} readOnly />
          </Form.Item>

          <Form.Item name="description">
            <Input addonBefore={<FileTextOutlined />} value={record.description || "N/A"} readOnly />
          </Form.Item>

          <Form.Item name="discountType">
            <Input addonBefore={<GiftOutlined />} value={record.discountType || "N/A"} readOnly />
          </Form.Item>

          <Form.Item name="dayDuration">
            <Input addonBefore={<ClockCircleOutlined />} value={record.dayDuration || "N/A"} readOnly />
          </Form.Item>
        </>)
      case "Course":
        return <CourseDetail id = {record.id}/>
      default:
        return null;
    }
  }
  let buttons;

  if (type !== "Course") {
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
        title={<span className="custom-modal-title">{modalAction} {type}</span>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
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