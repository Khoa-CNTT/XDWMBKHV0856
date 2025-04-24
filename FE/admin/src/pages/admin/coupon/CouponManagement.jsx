import { CheckCircleFilled, PlusCircleFilled, UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, message, Modal, Pagination, Select, Space, Table, Tooltip } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActionButtons from '../../../components/admin/ActionButton';
import { getAllCouponActionAsync } from '../../../redux/reducer/admin/couponReducer';
import { getAllUserActionAsync } from '../../../redux/reducer/admin/userReducer';
import { http } from '../../../setting/setting';

const CouponManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { apiCoupon } = useSelector(state => state.couponReducer) || [];
  const { meta } = useSelector(state => state.couponReducer) || {};
  const [couponPage, setCouponPage] = useState(1);
  const [couponPageSize, setCouponPageSize] = useState(3);
  const [headCode, setHeadCode] = useState("");
  const [discountType, setDiscountType] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const userApi = useSelector((state) => state.userReducer.userApi) || [];
  const [selectedUsers, setSelectedUsers] = useState([]);
  const toggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  const [searchUserText, setSearchUserText] = useState('');
  

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Mặc định 20 item mỗi trang
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = userApi.slice(startIndex, endIndex);

  const visibleUserIds = userApi.map(user => user.id);
  const isAllSelected = visibleUserIds.every(id => selectedUsers.includes(id));

  const userOptions = paginatedUsers.map((user) => {
    const isSelected = selectedUsers.includes(user.id);
    return (
      <div
        key={user.id}
        className={`user-card d-flex align-items-center px-2 py-1 mb-2 ${isSelected ? 'selected' : ''}`}
        onClick={() => toggleUser(user.id)}
      >
        {isSelected && <CheckCircleFilled className="check-icon" />}
        <div className="d-flex justify-content-center align-items-center">
          <Avatar
            src={`http://localhost:8080/storage/avatar/${user.id}/${user.avatar}`}
            size={48}
          />
        </div>
        <div className="ms-2 user-info">
          <strong style={{ fontSize: 14 }}>{user.fullName}</strong>
          <div style={{ fontSize: 12, color: '#555' }} className="email">{user.email}</div>
          <div style={{ fontSize: 10, color: '#999' }}>{user.role}</div>
        </div>
      </div>
    );
  });


  const handleSelectAllUsers = () => {
    const usersToSelect = userApi.map(user => user.id);
    if (isAllSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(usersToSelect);
    }
  };
   // Debounce để lọc dữ liệu khi người dùng nhập vào input
   const debouncedUserSearch = useCallback(
    debounce((value) => {
      setSearchUserText(value.toLowerCase());
    }, 300),
    [] 
  );
  
  const debouncedSearch = useCallback(
    debounce((value) => {
      setHeadCode(value);
      setCouponPage(1);
    }, 300),
    [] 
  );
  
  const showModalRelease = (record) => {
    form.setFieldsValue({
      couponId: record.id,
      headCode: record.headCode,
      dayDuration: record.dayDuration
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const filters = {
      fullName: searchUserText,
      role: selectedRole
    };

    dispatch(getAllUserActionAsync({ filters }));
  }, [searchUserText, selectedRole]);
  useEffect(() => {
    dispatch(
      getAllCouponActionAsync({
        page: couponPage,
        size: couponPageSize,
        filters: {
          headCode,
          discountType
        }
      })
    );
  }, [couponPage, couponPageSize, headCode, discountType, dispatch]);
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      debouncedUserSearch.cancel()
    };
  }, [debouncedSearch,debouncedUserSearch]);
 


  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          if (selectedUsers.length === 0) {
            message.warning("Vui lòng chọn ít nhất một người dùng để phát hành Coupon");
            return;
          }

          const payload = {
            coupon: {
              id: values.couponId,
            },
            users: selectedUsers.map(id => ({ id })),
          };

          // Hiển thị Modal Confirm trước khi thực hiện hành động
          Modal.confirm({
            title: 'Xác nhận phát hành Coupon',
            content: (
              <div>
                <p><strong>Mã Coupon:</strong> {values.headCode}</p>
                <p><strong>Thời gian hiệu lực:</strong> {values.dayDuration} ngày</p>
                <p><strong>Số người dùng được chọn:</strong> {selectedUsers.length}</p>
              </div>
            ),
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
              try {
                await http.post(`/v1/release-coupon`, payload);
                message.success("Thêm Coupon thành công");
                setSelectedUsers([]);  // Reset lại danh sách người dùng đã chọn
                form.resetFields();     // Reset lại form
                setIsModalOpen(false);  // Đóng modal
              } catch (error) {
                console.log("error: ", error)
                message.error("Có lỗi xảy ra,vui lòng thử lại");
              }
            },
            onCancel: () => {
            },
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
    setSelectedUsers([])
    setSelectedRole(null);
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
        record.discountType === "PERCENT" ? `${value}%` : `${value.toLocaleString()}₫`,
    },
    {
      title: "Duration",
      align: "center",
      dataIndex: "dayDuration",
      key: "dayDuration",
      render: (days) => `${days} ngày`,
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
            icon={<PlusCircleFilled />}
            style={{ color: "violet" }}
            className="custom-btn"
            onClick={() => showModalRelease(record)}
          />
        </div>
      )
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
    <div className="p-4">
      {/* Ô input tìm kiếm */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo mã Coupon..."
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={apiCoupon}
        rowKey="id"
        pagination={{
          current: couponPage,
          pageSize: couponPageSize,
          total: meta?.totalElement || 0,
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
              <Input placeholder="Nhập ID coupon" disabled />
            </Form.Item>

            <Form.Item name="headCode" label={<b>ID Coupon</b>} className='ms-2'>
              <Input readOnly />
            </Form.Item>

            <Form.Item name="dayDuration" label={<b>Day Duration</b>} className='ms-2'>
              <Input readOnly />
            </Form.Item>
          </div>
          <div className="d-flex justify-content-between w-100">
            {/* Bên trái */}
            <div className="d-flex">
              <Form.Item name="searchText" className="me-2">
                <Input
                  placeholder="Tìm kiếm theo tên ..."
                  onChange={(e) => debouncedUserSearch(e.target.value)}
                />
              </Form.Item>


              <Form.Item name="role">
                <Select
                  placeholder="Chọn vai trò"
                  style={{ width: "150%" }}
                  allowClear
                  options={[
                    { label: 'STUDENT', value: 'STUDENT' },
                    { label: 'INSTRUCTOR', value: 'INSTRUCTOR' },
                    { label: 'ADMIN', value: 'ADMIN' },
                  ]}
                  onChange={(value) => {
                    setSelectedRole(value)
                    setSelectedUsers([])
                  }}
                />
              </Form.Item>
            </div>

            {/* Bên phải */}
            <Button type="primary" icon={<UsergroupAddOutlined />} onClick={handleSelectAllUsers}>
              {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả user'}
            </Button>

          </div>
          <hr />
          <h5 className='text-center'>LIST USER</h5>
          <div className="user-card-container mt-3">
            {userOptions}
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={userApi.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>

        </Form>
      </Modal>
    </div>
  );
};

export default CouponManagement;
