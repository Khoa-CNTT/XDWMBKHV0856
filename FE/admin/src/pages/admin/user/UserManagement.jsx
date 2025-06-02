import { DeleteOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Switch, Table } from "antd";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButtons from "../../../components/admin/ActionButton";
import ButtonLog from "../../../components/admin/ButtonLog";
import CreateButton from "../../../components/admin/CreateButton";
import useLoading from "../../../hooks/useLoading";
import {
  deleteListActionAsync,
  getAllUserActionAsync,
  updateUserActiveActionAsync,
} from "../../../redux/reducer/admin/userReducer";
import { VITE_AVATAR_URL } from "../../../setting/api";
import { callApiLog } from "../../../utils/callApiLog";

export default function UserManagement() {
  const { userInfo } = useSelector((state) => state.authReducer) || {};
  const dispatch = useDispatch();
  const userApi = useSelector((state) => state.userReducer.userApi);
  const meta = useSelector((state) => state.userReducer.meta);
  const { loading, startLoading, stopLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState([]);
  console.log("userApi", userApi);

  const debouncedSearch = useMemo(() => {
    return debounce((value) => {
      setSearchText(value.trim());
      setCurrentPage(1);
    }, 300);
  }, []);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  });

  const handleDeleteUsers = () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} người dùng không?`,
      onOk: () => {
        dispatch(deleteListActionAsync(selectedRowKeys));
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        await dispatch(
          getAllUserActionAsync({
            page: currentPage,
            size: pageSize,
            filters: {
              email: searchText,
              fullName: searchText,
              role: roleFilter?.length > 0 ? roleFilter : undefined,
            },
          })
        );
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, [
    dispatch,
    currentPage,
    pageSize,
    searchText,
    roleFilter,
    startLoading,
    stopLoading,
  ]);

  // Chức năng chọn tất cả
  const onSelectAll = useCallback(
    (e) => {
      if (e.target.checked) {
        setSelectedRowKeys(userApi.map((user) => user.id));
      } else {
        setSelectedRowKeys([]);
      }
    },
    [userApi]
  );

  const handleCheckboxChange = (userId, checked) => {
    const newSelectedRowKeys = checked
      ? [...selectedRowKeys, userId]
      : selectedRowKeys.filter((id) => id !== userId);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectedRowKeys.length === userApi.length}
          onChange={onSelectAll}
        />
      ),
      key: "selectAll",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => handleCheckboxChange(record.id, e.target.checked)}
        />
      ),
      width: "5%",
    },
    { title: "ID", dataIndex: "id", key: "id", width: "5%" },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: "5%",
      render: (avatar, record) => {
        const imageUrl = `${VITE_AVATAR_URL}/${record.id}/${avatar}`;
        return <Avatar src={imageUrl} />;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "25%",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    { title: "Fullname", dataIndex: "fullName", key: "fullName", width: "20%" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "10%",
      filters: [
        { text: "ADMIN", value: "ADMIN" },
        { text: "STUDENT", value: "STUDENT" },
        { text: "INSTRUCTOR", value: "INSTRUCTOR" },
      ],
      filteredValue: roleFilter,
      filterMultiple: true, // cho phép chọn nhiều
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      width: "10%",
      render: (active, record) => {
        const isProtectedUser =
          userInfo?.role === "ADMIN" &&
          (record.role === "ADMIN" || record.role === "ROOT");

        return (
          <Switch
            checked={active}
            disabled={isProtectedUser}
            onChange={() => {
              Modal.confirm({
                title: "Xác nhận thay đổi trạng thái",
                content: `Bạn có chắc muốn ${
                  active ? "tắt" : "bật"
                } trạng thái của người dùng này không?`,
                onOk: async () => {
                  const res = await dispatch(
                    updateUserActiveActionAsync(record.id, !active)
                  );
                  if (res.status === 200) {
                    const statusText = res.data.active ? "inactive" : "active";
                    await callApiLog(
                      userInfo?.id,
                      "USER",
                      `${userInfo?.email} has ${statusText} user status of ${record.email}`
                    );
                  }
                },
              });
            }}
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      align: "center",
      render: (_, record) => {
        const isProtectedUser =
          userInfo?.role === "ADMIN" &&
          (record.role === "ADMIN" || record.role === "ROOT");

        return (
          <ActionButtons
            type="User"
            record={record}
            disabled={isProtectedUser}
            userInfo={userInfo}
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between">
        <CreateButton type="User" userInfo={userInfo} />
        <ButtonLog tab="USER" />
      </div>
      <div>
        {/* Ô tìm kiếm */}
        <Input
          value={inputValue}
          placeholder="Tìm kiếm theo tên hoặc email..."
          onChange={handleInputChange}
          style={{ width: 300, marginBottom: "20px" }}
        />

        {/* Nút xóa */}
        {selectedRowKeys.length > 0 && (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            style={{ float: "right", marginBottom: 16, zIndex: "1000" }}
            onClick={handleDeleteUsers}
          >
            Xóa ({selectedRowKeys.length})
          </Button>
        )}

        {/* Bảng danh sách */}
        <Table
          className="admin-table"
          tableLayout="auto"
          columns={columns}
          loading={loading}
          dataSource={userApi.filter((user) => user.role !== "ROOT")}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: meta.totalElement,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15", "20"],
          }}
          onChange={(pagination, filters) => {
            setCurrentPage(pagination.current);
            setPageSize(pagination.pageSize);
            if (filters.role) {
              setRoleFilter(Array.isArray(filters.role) ? filters.role : []);
            } else {
              setRoleFilter([]);
            }
          }}
          bordered
        />
      </div>
    </>
  );
}
