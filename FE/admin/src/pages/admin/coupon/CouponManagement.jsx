import { Space, Table, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActionButtons from '../../../components/admin/ActionButton';
import { getAllCouponActionAsync } from '../../../redux/reducer/admin/couponReducer';

const CouponManagement = () => {
  const columns = [
    {
      title: "ID Coupon",
      dataIndex: "headCode",
      key: "headCode",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "discountType",
      dataIndex: "discountType",
      key: "discountType",
      align: "center",
      width: "20px",
      filters: [
        { text: "%", value: "PERCENT" },
        { text: "VNĐ", value: "VND" },
      ],
      onFilter: (value, record) => record.discountType === value,
      render: (type) => (type === "PERCENT" ? "%" : "VNĐ"),
    },
    {
      title: "Value",
      align: "center",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value - b.value,
      render: (value, record) =>
        record.discountType === "PERCENT" ? `${value}%` : `${value.toLocaleString()}₫`,
    },
    {
      title: "Duration",
      align: "center",
      dataIndex: "dayDuration",
      key: "dayDuration",
      sorter: (a, b) => a.dayDuration - b.dayDuration,
      render: (days) => `${days} ngày`,
    },
    {
      title: "Action",
      align: "center",
      key: "action",
      render: (_, record) => (
        <Space>
          <ActionButtons type="Coupon" record={record}/>
        </Space>
      ),
    },
  ];
  const {apiCoupon} = useSelector(state => state.couponReducer || [])
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllCouponActionAsync())
  },[])
 

  return (
    <div className="p-4">
      <Table columns={columns} dataSource={apiCoupon} rowKey="id" pagination={{ pageSize: 5 }}  bordered/>
    </div>
  );
};


export default CouponManagement