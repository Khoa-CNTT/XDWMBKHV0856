// components/AddCouponForm.jsx
import { Form, Input, InputNumber, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const AddCouponForm = () => {
  return (
    <>
      <Form.Item
        name="headCode"
        rules={[{ required: true, message: 'Head code is required!' }]}
      >
        <Input placeholder="Head Code (e.g., SALE20)" />
      </Form.Item>

      <Form.Item
        name="description"
        rules={[{ required: true, message: 'Description is required!' }]}
      >
        <Input.TextArea rows={3} placeholder="Coupon description" />
      </Form.Item>

      <Form.Item
        name="discountType"
        rules={[{ required: true, message: 'Discount type is required!' }]}
      >
        <Select placeholder="Select discount type">
          <Option value="PERCENT">Percentage (%)</Option>
          <Option value="FIXED">Fixed amount (VND)</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="value"
        rules={[
          {
            required: true,
            message: 'Please enter the discount value',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              const discountType = getFieldValue('discountType');
              if (discountType === 'PERCENT') {
                if (value < 1 || value > 100) {
                  return Promise.reject(
                    'Percentage value must be between 1% and 100%'
                  );
                }
              } else if (value < 1000) {
                return Promise.reject(
                  'Value must be greater than or equal to 1000'
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input placeholder="Enter discount value" />
      </Form.Item>

      <Form.Item
        name="dayDuration"
        rules={[
          { required: true, message: 'Day duration in days is required!' },
          { type: 'number', min: 1, message: 'At least 1 day!' },
        ]}
      >
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          placeholder="Validity duration (days)"
        />
      </Form.Item>
    </>
  );
};

export default AddCouponForm;
