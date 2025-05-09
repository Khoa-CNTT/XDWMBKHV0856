import {
    BarcodeOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    IdcardFilled,
    MoneyCollectFilled,
} from "@ant-design/icons";
import { Form, Input, Select } from "antd";

const CouponEditForm = ({ record }) => (
  <>
    <Form.Item name="id">
      <Input addonBefore={<IdcardFilled />} value={record.id || "N/A"} readOnly />
    </Form.Item>

    <Form.Item name="headCode">
      <Input addonBefore={<BarcodeOutlined />} value={record.headCode || "N/A"} />
    </Form.Item>

    <Form.Item
      name="description"
      rules={[{ required: true, message: "Description is required!" }]}
    >
      <Input addonBefore={<FileTextOutlined />} value={record.description || "N/A"} />
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
        { required: true, message: "Please enter the discount value" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            const discountType = getFieldValue("discountType");
            if (discountType === "PERCENT" && (value < 1 || value > 100)) {
              return Promise.reject("The percentage value must be between 1% and 100%");
            }
            if (value <= 0) {
              return Promise.reject("The value must be greater than 0");
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
);

export default CouponEditForm;
