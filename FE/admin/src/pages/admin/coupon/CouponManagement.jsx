import { RocketFilled } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tooltip,
} from "antd";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButtons from "../../../components/admin/ActionButton";
import CreateButton from "../../../components/admin/CreateButton";
import ListUser from "../../../components/admin/ListUser";
import useLoading from "../../../hooks/useLoading";
import { getAllCouponActionAsync } from "../../../redux/reducer/admin/couponReducer";
import { http } from "../../../setting/setting";

const CouponManagement = () => {
  const { loading, startLoading, stopLoading } = useLoading();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // Dữ liệu Coupon
  const { apiCoupon } = useSelector((state) => state.couponReducer) || [];
  // Phân trang Coupon
  // const { meta } = useSelector(state => state.couponReducer) || {};
  // Mở Modal Release
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponPage, setCouponPage] = useState(1);
  const [couponPageSize, setCouponPageSize] = useState(5);
  //Mã coupon
  const [headCode, setHeadCode] = useState("");
  //Loại giảm giá Coupon
  const [discountType, setDiscountType] = useState(null);
  //Chọn role user
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setHeadCode(value);
      setCouponPage(1);
    }, 300),
    []
  );

  const showModalRelease = (record) => {
    const formattedValue =
      record.discountType === "PERCENT"
        ? `${record.value}%`
        : `${record.value.toLocaleString()}VNĐ`;
    form.setFieldsValue({
      couponId: record.id,
      headCode: record.headCode,
      dayDuration: record.dayDuration,
      value: formattedValue,
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      startLoading();
      try {
        await dispatch(
          getAllCouponActionAsync({
            page: couponPage,
            size: couponPageSize,
            filters: {
              headCode,
              discountType,
            },
          })
        );
      } finally {
        stopLoading();
      }
    };
  
    fetchCoupons();
  }, [couponPage, couponPageSize, headCode, discountType, dispatch, startLoading, stopLoading]);
  
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          if (selectedUsers.length === 0) {
            message.warning(
              "Vui lòng chọn ít nhất một người dùng để phát hành Coupon"
            );
            return;
          }

          const payload = {
            coupon: {
              id: values.couponId,
            },
            users: selectedUsers.map((id) => ({ id })),
          };

          // Hiển thị Modal Confirm trước khi thực hiện hành động
          Modal.confirm({
            title: "Xác nhận phát hành Coupon",
            content: (
              <div>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  style={{ marginRight: 32 }}
                  styles={{ label: { width: 150 } }}
                >
                  <Descriptions.Item label="Mã Coupon">
                    {values.headCode}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian hiệu lực">
                    {values.dayDuration} ngày
                  </Descriptions.Item>
                  <Descriptions.Item label="Số người dùng ">
                    {selectedUsers.length}
                  </Descriptions.Item>
                  <Descriptions.Item label="Value">
                    {values.value}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ),
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
              try {
                await http.post(`/v1/release-coupon`, payload);
                message.success("Thêm Coupon thành công");
                setSelectedUsers([]); // Reset lại danh sách người dùng đã chọn
                form.resetFields(); // Reset lại form
                setIsModalOpen(false); // Đóng modal
              } catch (error) {
                message.error("Có lỗi xảy ra,vui lòng thử lại");
              }
            },
            onCancel: () => {},
          });
        } catch (info) {
          console.log("Validation Failed:", info);
        }
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setSelectedUsers([]);
    setSelectedRole([]);
  };

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
      title: "Type",
      dataIndex: "discountType",
      key: "discountType",
      align: "center",
      width: 100,
      filters: [
        { text: "%", value: "PERCENT" },
        { text: "VNĐ", value: "FIXED" },
      ],
      filteredValue: discountType ? [discountType] : null,
      filterMultiple: false,
      filterDropdownProps: {
        onOpenChange: (open) => {
          if (!open) return;
        },
      },
      render: (type) => (type === "PERCENT" ? "%" : "VNĐ"),
    },
    {
      title: "Value",
      align: "center",
      dataIndex: "value",
      key: "value",
      render: (value, record) =>
        record.discountType === "PERCENT"
          ? `${value}%`
          : `${value.toLocaleString()}₫`,
    },
    {
      title: "Duration",
      align: "center",
      dataIndex: "dayDuration",
      key: "dayDuration",
      render: (days) => `${days} day`,
    },
    {
      title: "Release",
      align: "center",
      key: "release",
      width: "10px",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="text"
            icon={<RocketFilled />}
            style={{ fontSize: "24px", color: "	#ff6b6b" }}
            className="custom-btn"
            onClick={() => showModalRelease(record)}
          />
        </div>
      ),
    },
    {
      title: "Action",
      align: "center",
      key: "action",
      render: (_, record) => (
        <Space>
          <ActionButtons type="Coupon" record={record} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-2">
      <CreateButton type="Coupon" />
      {/* Ô input tìm kiếm */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search head code coupon..."
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {/* Bảng dữ liệu */}
      <Table
        className="admin-table"
        columns={columns}
        dataSource={apiCoupon}
        loading={loading}
        rowKey="id"
        pagination={{
          current: couponPage,
          pageSize: couponPageSize,
          // total: meta?.totalElement || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15", "20"],
        }}
        onChange={(pagination, filters) => {
          setCouponPage(pagination.current);
          setCouponPageSize(pagination.pageSize);

          const type = filters.discountType?.[0] || null;
          setDiscountType(type);
        }}
        bordered
      />

      {/* Modal phát hành coupon */}
      <Modal
        title={<strong style={{ fontSize: "20px" }}>RELEASE COUPON</strong>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Gửi"
        cancelText="Hủy"
        width={1000}
        className="custom-modal"
      >
        <Form form={form} layout="vertical" name="release_coupon_form">
          <div className="d-flex">
            <Form.Item name="couponId" label={<b>ID</b>}>
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="headCode"
              label={<b>ID Coupon</b>}
              className="ms-2"
            >
              <Input readOnly />
            </Form.Item>

            <Form.Item
              name="dayDuration"
              label={<b>Day Duration</b>}
              className="ms-2"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item name="value" label={<b>Value</b>} className="ms-2">
              <Input readOnly />
            </Form.Item>
          </div>
          <ListUser
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            setSelectedUsers={setSelectedUsers}
            selectedUsers={selectedUsers}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default CouponManagement;
