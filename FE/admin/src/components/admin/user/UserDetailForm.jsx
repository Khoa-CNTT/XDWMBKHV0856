import {
    HomeOutlined,
    MailOutlined,
    PhoneOutlined,
    TagOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Form, Input } from "antd";

const UserDetailForm = ({ record }) => (
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

export default UserDetailForm;
