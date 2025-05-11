import { CheckCircleFilled, UsergroupAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, Pagination, Select, Tooltip } from "antd";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserActionAsync } from "../../redux/reducer/admin/userReducer";

const ListUser = ({
  selectedRole,
  setSelectedRole,
  setSelectedUsers,
  selectedUsers,
}) => {
  const [searchUserText, setSearchUserText] = useState("");

  const userApi = useSelector((state) => state.userReducer.userApi) || [];
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 20; // Mặc định 20 item mỗi trang
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = userApi.slice(startIndex, endIndex);
  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  const handleSelectAllUsers = () => {
    const usersToSelect = userApi.map((user) => user.id);
    if (isAllSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(usersToSelect);
    }
  };
  const dispatch = useDispatch();
  const visibleUserIds = userApi.map((user) => user.id);
  const isAllSelected = visibleUserIds.every((id) =>
    selectedUsers.includes(id)
  );
  const debouncedUserSearch = useCallback(
    debounce((value) => {
      setSearchUserText(value.toLowerCase());
    }, 300),
    []
  );

  const userOptions = paginatedUsers.map((user) => {
    const isSelected = selectedUsers.includes(user.id);
    return (
      <div
        key={user.id}
        className={`user-card d-flex align-items-center px-2 py-1 mb-2 ${
          isSelected ? "selected" : ""
        }`}
        onClick={() => toggleUser(user.id)}
      >
        {isSelected && <CheckCircleFilled className="check-icon" />}
        <div className="d-flex justify-content-center align-items-center">
          <Avatar
            src={`http://localhost:8080/storage/avatar/${user.id}/${user.avatar}`}
            size={48}
          />
        </div>

        <Tooltip
          title={
            <div>
              <div>
                <strong>{user.fullName}</strong>
              </div>
              <div>{user.email}</div>
            </div>
          }
          styles={{ root: { maxWidth: "none", whiteSpace: "nowrap" } }}
        >
          <div className="ms-2 user-info">
            <strong style={{ fontSize: 14 }} className="fullName">
              {user.fullName}
            </strong>
            <div style={{ fontSize: 12, color: "#555" }} className="email">
              {user.email}
            </div>
            <div style={{ fontSize: 10, color: "#999" }}>{user.role}</div>
          </div>
        </Tooltip>
      </div>
    );
  });

  useEffect(() => {
    setSelectedUsers([]);
    const filters = {
      fullName: searchUserText,
      email: searchUserText,
      role: selectedRole.length ? selectedRole : undefined,
    };

    dispatch(getAllUserActionAsync({ filters }));
  }, [searchUserText, selectedRole]);

  useEffect(() => {
    return () => {
      debouncedUserSearch.cancel();
    };
  }, [debouncedUserSearch]);
  return (
    <>
      <div className="d-flex justify-content-between w-100">
        {/* Bên trái */}
        <div className="d-flex">
          <Form.Item name="searchText" className="me-2">
            <Input
              placeholder="Search by fullName or email..."
              onChange={(e) => debouncedUserSearch(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="role">
            <Select
              dropdownRender={(menu) => (
                <div>
                  {menu}
                </div>
              )}
              mode="multiple"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value)}
              placeholder="Select Role(s)"
              style={{ width: 200 }}
              options={[
                { label: "STUDENT", value: "STUDENT" },
                { label: "INSTRUCTOR", value: "INSTRUCTOR" },
                { label: "ADMIN", value: "ADMIN" },
              ]}
              maxTagCount={1}
            />
          </Form.Item>
        </div>

        {/* Bên phải */}
        {userApi.length > 0 && (
          <Button
            type="primary"
            icon={<UsergroupAddOutlined />}
            onClick={handleSelectAllUsers}
          >
            {isAllSelected ? "Deselect all" : "Select all users"}
          </Button>
        )}
      </div>
      <hr />
      <h5 className="text-center">LIST USER</h5>
      <div className="user-card-container mt-3">{userOptions}</div>
      <div className="d-flex justify-content-center mt-3">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={userApi.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};

export default ListUser;
