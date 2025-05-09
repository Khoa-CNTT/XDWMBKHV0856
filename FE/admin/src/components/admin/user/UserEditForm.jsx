import { HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Select } from "antd";

const { Option } = Select;

const UserEditForm = ({ record }) => (
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

export default UserEditForm;
