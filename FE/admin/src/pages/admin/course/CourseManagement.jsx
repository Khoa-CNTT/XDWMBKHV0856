import { Input, Space, Spin, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButtons from "../../../components/admin/ActionButton";
import CreateButton from "../../../components/admin/CreateButton";
import useLoading from "../../../hooks/useLoading";
import { getAllCourseActionAsync } from "../../../redux/reducer/admin/courseReducer";

export default function CourseManagement() {
  const { loading, startLoading, stopLoading } = useLoading();
  const { apiCourse } = useSelector((state) => state.courseReducer) || [];
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState(null);
  const [searchText, setSearchText] = useState(""); 
  useEffect(() => {
    if(apiCourse.length === 0) {
      startLoading();
    dispatch(getAllCourseActionAsync()).finally(stopLoading);
    }
  }, [dispatch, startLoading, stopLoading]);

  // Lọc dữ liệu theo title, bỏ qua khoảng trắng
  const filteredData = apiCourse?.filter((item) => {
    const normalizedTitle = (item.title || '').toLowerCase().trim();
    const normalizedSearchText = searchText.toLowerCase().trim();
    return normalizedTitle.includes(normalizedSearchText) && item.status === 'PENDING';
  });

  

  const columns = [
    {title: "ID",dataIndex: "id",width: "10%",},
    {title: (
        <Space direction="vertical">
          <span>Title</span>

        </Space>
      ),
      dataIndex: "title",render: (text) => <a>{text}</a>,width: "20%",
    },
    {title: "Owner",dataIndex: "owner",render: (owner) => <span>{owner?.email || "N/A"}</span>,width: "20%",
    },
    {
      title: <span>{sortOrder === "ascend" ? "Price (tăng)" : sortOrder === "descend" ? "Price (giảm)" : "Price"}</span>,
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortOrder,
      width: "12%",
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrder((prev) =>
            prev === "ascend" ? "descend" : prev === "descend" ? null : "ascend"
          );
        },
      }),
      render: (price) => <span>{price?.toLocaleString("vi-VN")} VND</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      render: (status) => {
        let color;
        if (status === "PENDING") {color = "orange";} 
        else if (status === "APPROVED") {color = "blue";} 
        else {color = "red";}
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {title: "Action", width: "15%",render: (_, record) => <ActionButtons type="Course" record={record} />,},
];

  return (
    <>
    <CreateButton type="Order"/>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spin />
      </div>
      
      ) : (
        <>
          <div className="div">
            <Input
              placeholder="Search by title..." value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear style={{ marginBottom: 16, width: 300 }}
            />
          </div>
          <Table
            className="admin-table" columns={columns} dataSource={filteredData}
            rowKey="id" pagination={{ pageSize: 5 }} bordered
          />
        </>
      )}
    </>
  );
  
}
