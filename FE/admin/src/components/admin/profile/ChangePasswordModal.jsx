import { Button, Form, Input, message, Modal } from "antd";
import { InputOTP } from "antd-input-otp";
import bcrypt from "bcryptjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "../../../assets/images/logo.png";
import { getCookie, http } from "../../../setting/setting";

const ChangePasswordModal = ({ open, onClose, userInfo, passwordForm }) => {
  const [stage, setStage] = useState("email"); 
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    let timer;
    if (stage === "verify" && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, stage]);

  const handleSendVerifyCode = async () => {
    try {
      setLoading(true);
      await http.post("/v1/email/verify", { email: userInfo.email });
      message.success("Mã xác nhận đã được gửi đến email!");
      setStage("verify");
      setResendTimer(60); // bắt đầu đếm ngược
    } catch (error) {
      message.error(
        `Lỗi gửi mã: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      await http.post("/v1/email/verify", { email: userInfo.email });
      message.success("Đã gửi lại mã xác nhận mới!");
      setResendTimer(60); // reset countdown
    } catch (error) {
      message.error("Lỗi khi gửi lại mã xác nhận.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (values) => {
    try {
      setLoading(true);
      const storedCodeHash = getCookie("code");

      // ép thành chuỗi
      const inputCode = Array.isArray(values.code)
        ? values.code.join("")
        : values.code;

      const isMatch = await bcrypt.compare(inputCode, storedCodeHash);

      if (isMatch) {
        message.success("Xác minh thành công! Mời nhập mật khẩu mới.");
        setStage("reset");
      } else {
        message.error("Mã xác minh không đúng hoặc đã hết hạn.");
      }
    } catch (error) {
      message.error("Lỗi khi xác minh mã.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      setLoading(true);
      const res = await http.patch("/v1/user.password", {
        id: userInfo.id,
        password: values.password,
      });
      if (res.status === 200) {
        message.success("Đổi mật khẩu thành công!");
        onClose();
        passwordForm.resetFields();
        setStage("email");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (stage) {
      case "email":
        return (
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleSendVerifyCode}
            className="fade-in"
          >
            <div className="modal-content-custom">
              <p className="modal-description">
                Bấm nút bên dưới để nhận mã xác minh qua email.
              </p>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="button-block"
              >
                Gửi mã xác nhận
              </Button>
            </div>
          </Form>
        );
      case "verify":
        return (
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleVerifyCode}
          >
            <Form.Item
              label={<div className="text-center my-2 fs-5"><strong>Mã xác nhận</strong></div>}
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập mã xác nhận!" },
              ]}
            >
              <InputOTP length={5} autoFocus className="otp-input" />
            </Form.Item>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Xác minh
              </Button>
              <Button
                type="link"
                onClick={handleResendCode}
                disabled={resendTimer > 0}
                className="resend-link"
              >
                {resendTimer > 0
                  ? `Gửi lại mã sau ${resendTimer}s`
                  : "Gửi lại mã xác nhận"}
              </Button>
            </div>
          </Form>
        );
      case "reset":
        return (
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleResetPassword}
          >
            <Form.Item
              label="Mật khẩu mới"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 8, message: "Mật khẩu tối thiểu 8 ký tự!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đổi mật khẩu
            </Button>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={<div className="text-center my-2 mb-2"><h3>Thay đổi mật khẩu</h3></div>}
      open={open}
      onCancel={() => {
        onClose();
        setStage("email");
        passwordForm.resetFields();
      }}
      footer={null}
    >
      <div style={{ textAlign: "center",backgroundColor: "#000" }}>
        <img src={logo} alt="Logo" className="w-50"  />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderForm()}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default ChangePasswordModal;
