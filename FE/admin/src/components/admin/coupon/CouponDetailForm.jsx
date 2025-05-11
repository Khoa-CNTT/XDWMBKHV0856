import {
    BarcodeOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    GiftOutlined,
} from "@ant-design/icons";
import { Form, Input } from "antd";

const CouponDetailForm = ({ record }) => (
  <>
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
  </>
);

export default CouponDetailForm;
