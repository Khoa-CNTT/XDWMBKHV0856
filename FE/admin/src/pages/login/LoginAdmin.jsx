import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import team from '../../assets/images/team.jpg';
import { loginActionAsync } from '../../redux/reducer/auth/authReducer';

const LoginAdmin = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try {
            console.log('Dữ liệu đăng nhập:', values);
            await dispatch(loginActionAsync(values))
            message.success("Đăng nhập thành công")
            navigate("/admin");
        } catch (error) {
            message.error("Đã xảy ra lỗi: ",error)
        }

    };

    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">
                    <div className="login100-pic">
                        <img src={team} alt="IMG" />
                    </div>

                    <Form
                        form={form}
                        name="login-form"
                        className="login100-form"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <span className="login100-form-title">
                            <b>ĐĂNG NHẬP HỆ THỐNG <br /> V-LEARNING</b>
                        </span>

                        <Form.Item
                            name="loginName"
                            rules={[{ required: true, message: 'Vui lòng nhập tài khoản quản trị!' }]}
                        >
                            <Input
                                size="large"
                                placeholder="Tài khoản quản trị"
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Mật khẩu"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login100-form-btn"
                                block
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
