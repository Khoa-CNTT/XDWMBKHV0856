import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import team from '../../assets/images/team.jpg';
import { loginActionAsync } from '../../redux/reducer/auth/authReducer';

const LoginAdmin = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const onFinish = async (values) => {
        try {
            await dispatch(loginActionAsync(values))
        } catch (error) {
            message.error("An error occurred: ",error)
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
                            <b>System Login <br /> V-LEARNING</b>
                        </span>

                        <Form.Item
                            name="loginName"
                            rules={[{ required: true, message: 'Please enter the admin account!' }]}
                        >
                            <Input
                                size="large"
                                placeholder="Admin account"
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please enter the password.!' }]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Password"
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
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
