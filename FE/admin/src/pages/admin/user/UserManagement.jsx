import { DeleteOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Spin, Switch, Table } from "antd";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButtons from "../../../components/admin/ActionButton";
import useLoading from "../../../hooks/useLoading";
import {
  deleteListActionAsync,
  getAllUserActionAsync,
  updateUserActiveActionAsync,
} from "../../../redux/reducer/admin/userReducer";

export default function UserManagement() {
  const dispatch = useDispatch();
  const userApi = useSelector((state) => state.userReducer.userApi);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [searchText, setSearchText] = useState("");
  const { loading, startLoading, stopLoading } = useLoading();

  // Lưu trạng thái checkbox được chọn
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  useEffect(() => {
    startLoading()
    dispatch(getAllUserActionAsync()).finally(stopLoading);
  }, [dispatch,startLoading,stopLoading]);

  // Lọc dữ liệu
  const filteredData = useMemo(() => {
    const searchValue = searchText.toLowerCase().replace(/\s/g, "");
    return userApi.filter(
      (user) =>
        user.email.toLowerCase().replace(/\s/g, "").includes(searchValue) ||
        user.fullName.toLowerCase().replace(/\s/g, "").includes(searchValue)
    );
  }, [searchText, userApi]);

  // Debounce tìm kiếm
  const handleSearch = debounce((value) => {
    setSearchText(value);
  }, 300);

  //Xóa tất cả
  const handleDeleteUsers = () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} người dùng không?`,
      onOk: () => {
        dispatch(deleteListActionAsync(selectedRowKeys));
      },
    });
  };
  
  const columns = [
  
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (avatar, record) => {
        const imageUrl = avatar
          ? `http://localhost:8080/storage/avatar/${record.id}/${avatar}`
          : "https://1nedrop.com/wp-content/uploads/2024/10/avatar-fb-mac-dinh-56hPlMap.jpg";
    
        return <Avatar src={imageUrl} />;
      },
    },
    { title: "Email", dataIndex: "email", key: "email", width: "20%" },
    { title: "Fullname", dataIndex: "fullName", key: "fullName", width: "20%" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "15%",
      filters: [
        { text: "ADMIN", value: "ADMIN" },
        { text: "STUDENT", value: "STUDENT" },
        { text: "INSTRUCTOR", value: "INSTRUCTOR" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      width: "10%",
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={() => {
            Modal.confirm({
              title: "Xác nhận thay đổi trạng thái",
              content: `Bạn có chắc muốn ${active ? "tắt" : "bật"} trạng thái của người dùng này không?`,
              onOk: () => {
                dispatch(updateUserActiveActionAsync(record.id, !active)).then(() =>
                  dispatch(getAllUserActionAsync())
                );
              },
            });
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => <ActionButtons type="User" record={record} />,
    },
  ];

  return <>
    {loading ? (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
  <Spin />
</div>
) : (
  <div>
    {/* Ô tìm kiếm */}
    <Input
      placeholder="Tìm kiếm theo tên hoặc email..."
      onChange={(e) => handleSearch(e.target.value)}
      style={{ marginBottom: 16, width: 300 }}
    />

    {/* Nút xóa */}
    {selectedRowKeys.length > 0 && (
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        style={{ float: "right", marginBottom: 16 }}
        onClick={handleDeleteUsers}
      >
        Xóa ({selectedRowKeys.length})
      </Button>
    )}

    {/* Bảng danh sách */}
    <Table
      className="admin-table"
      rowSelection={rowSelection}
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: filteredData.length,
        onChange: (page) => setCurrentPage(page),
        showSizeChanger: false,
      }}
      bordered
    />
  </div>
)}

  </>
}
