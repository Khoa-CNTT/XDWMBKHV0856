import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Descriptions, Form, Modal, Select } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCouponActionAsync } from "../../redux/reducer/admin/couponReducer";
import { addUserActionAsync } from "../../redux/reducer/admin/userReducer";
import { callApiLog } from "../../utils/callApiLog";
import AddCouponForm from "./coupon/AddCouponForm";
import AddUserForm from "./user/AddUserForm";

const CreateButton = ({ type,userInfo }) => {
  // --------------------------------------Courses------------------------------------
  
  // ------------------------------------------------------------------------------------

  // State để quản lý trạng thái mở/đóng của modal nhập thông tin
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State để quản lý trạng thái mở/đóng của modal xác nhận
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // Tạo instance của Form để quản lý dữ liệu nhập
  const [form] = Form.useForm();
  const { Option } = Select;
  const dispatch = useDispatch();
  // State lưu trữ dữ liệu nhập vào để hiển thị trong modal xác nhận
  const [formData, setFormData] = useState(null);

  // Mở modal nhập thông tin
  const showModal = () => setIsModalOpen(true);

  // Đóng modal nhập thông tin và reset dữ liệu form
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Khi nhấn "OK" trong modal nhập -> Hiển thị form xác nhận
  const handleOk = async () => {
    try {
      // Validate dữ liệu nhập vào form
      const values = await form.validateFields();
      setFormData(values); // Lưu dữ liệu vào state
      setIsModalOpen(false); // Đóng modal nhập thông tin
      setIsConfirmModalOpen(true); // Mở modal xác nhận
    } catch (error) {
      // Hiển thị thông báo lỗi nếu nhập thiếu thông tin
      Modal.error({ title: "Validation Failed", content: "Please fill in all the information!" });
    }
  };

  // Khi nhấn "Confirm" trong modal xác nhận -> Gửi dữ liệu tới Redux
  const handleConfirm = async () => {
    if (formData) {
      if (type === "User") {
        const newUser = await dispatch(addUserActionAsync(formData));
        if (newUser?.id) {
          await callApiLog(userInfo?.id, "USER", `Created a user with id ${newUser.id}`);
        }
      } else if (type === "Coupon") {
        const newCoupon = await dispatch(addCouponActionAsync(formData));
        if (newCoupon?.id) {
          await callApiLog(userInfo?.id, "COUPON", `Created a coupon with id ${newCoupon.id}`);
        }
      }
    }
    setIsConfirmModalOpen(false);
    form.resetFields();
  };
  

  // Khi nhấn "Cancel" trong modal xác nhận -> Quay lại modal nhập thông tin
  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
    setIsModalOpen(true);
  };

  // Hàm render form nhập thông tin dựa vào loại dữ liệu
  const renderForm = () => {
    if (type === "User") {
      return <AddUserForm/>;
    } else if (type === "Coupon") {
      return <AddCouponForm/>;
    }
    return null; 
  };
  const formatFormDataForDisplay = (data) => {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        result[key] = value.map(v => v?.id || v).join(', ');
      } else {
        result[key] = typeof value === 'object' ? JSON.stringify(value) : value;
      }
    }
    return result;
  };
  

  return (
    <>
      {/* Nút mở modal nhập thông tin */}
      <Button type="primary" danger icon={<PlusOutlined />} style={{ marginBottom: "16px" }} onClick={showModal}>
        Add New {type}
      </Button>

      {/* Modal nhập thông tin */}
      <Modal title={`Create New ${type}`} open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>
        <Form form={form} layout="vertical">{renderForm()}</Form>
      </Modal>

      {/* Modal xác nhận thông tin */}
      <Modal
        title="Confirm Information"
        open={isConfirmModalOpen}
        onOk={handleConfirm}
        onCancel={handleCancelConfirm}
        okText="Confirm"
        cancelText="Edit"
        icon={<ExclamationCircleOutlined />}
      >
        {/* Hiển thị danh sách thông tin đã nhập để xác nhận */}
        {formData && (
          <Descriptions column={1} bordered size="small">
          {Object.entries(formatFormDataForDisplay(formData)).map(([key, value]) => (
            <Descriptions.Item label={key} key={key}>{value}</Descriptions.Item>
          ))}
        </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default CreateButton;
