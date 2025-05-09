// components/AddUserForm.jsx
import {
  FormOutlined,
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const AddUserForm = () => {
  return (
    <>
      <Form.Item
        name="fullName"
        rules={[{ required: true, message: 'FullName is required!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="FullName" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Email is required!' },
          { type: 'email', message: 'Invalid email format!' },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            message: 'Email must be a Gmail address (e.g., example@gmail.com)',
          },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="address"
        rules={[{ required: true, message: 'Address is required!' }]}
      >
        <Input prefix={<HomeOutlined />} placeholder="Address" />
      </Form.Item>

      <Form.Item
        name="phone"
        rules={[
          { required: true, message: 'Phone is required!' },
          {
            pattern: /^[0-9]{10}$/,
            message: 'Phone number must be exactly 10 digits!',
          },
        ]}
      >
        <Input prefix={<FormOutlined />} placeholder="Phone" maxLength={10} />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 8, message: 'Password must be at least 8 characters!' }
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item name="role" rules={[{ required: true, message: 'Role is required!' }]}>
        <Select placeholder="Select a role">
          <Option value="STUDENT">STUDENT</Option>
          <Option value="ADMIN">ADMIN</Option>
          <Option value="INSTRUCTOR">INSTRUCTOR</Option>
        </Select>
      </Form.Item>

      {/*
      <Form.Item label="Upload Avatar">
        <Upload action="/upload.do" listType="picture-card">
          <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        </Upload>
      </Form.Item>
      */}
    </>
  );
};

export default AddUserForm;
