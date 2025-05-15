import { CheckOutlined } from "@ant-design/icons";
import { Button, Form, Input, List, Pagination, Select } from "antd";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserActionAsync } from "../../../redux/reducer/admin/userReducer";

const UserSelector = ({ selectedUser, onUserSelect }) => {
  const [userForm] = Form.useForm();
  const dispatch = useDispatch();
  const userApi = useSelector((state) => state.userReducer?.userApi || []);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState([]);
  const [searchUserText, setSearchUserText] = useState("");

  const debouncedUserSearch = useCallback(
    debounce((value) => {
      setSearchUserText(value.toLowerCase());
    }, 300),
    []
  );

  useEffect(() => {
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
      <Form form={userForm}>
        <div className="d-flex">
          <Form.Item name="searchText" className="me-2">
            <Input
              placeholder="Search by fullName or email..."
              onChange={(e) => debouncedUserSearch(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="role">
            <Select
              dropdownRender={(menu) => menu}
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
      </Form>

      <List
        bordered
        dataSource={userApi}
        renderItem={(user) => {
            const isSelected = selectedUser?.id === user.id;
            return (
                <List.Item
                  actions={[
                    <Button type={isSelected ? "default" : "primary"} onClick={() => onUserSelect(isSelected ? null : user)}>
                      {isSelected ? "Bỏ chọn" : "Chọn"}
                    </Button>,
                  ]}
                >
                  <div>
                    <b>{user.fullName}</b> - {user.email} - [{user.role}]
                    {selectedUser?.id === user.id && (
                      <CheckOutlined style={{ color: "green", marginLeft: 8 }} />
                    )}
                  </div>
                </List.Item>
              )
        }}
        style={{ maxHeight: 300, overflowY: "auto" }}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={userApi.length}
        showSizeChanger
        pageSizeOptions={["5", "10", "15", "20"]}
        onChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
        className="mt-3 text-center justify-content-end"
      />
    </>
  );
};

export default UserSelector;
