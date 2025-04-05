import { Input, Modal, Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButtons from "../../../components/admin/ActionButton";
import LoadingPage from "../../../components/common/LoadingPage";
import useLoading from "../../../hooks/useLoading";
import {
  getAllCourseActionAsync
} from "../../../redux/reducer/admin/courseReducer";
import {
  getAllFieldActionAsync,
  getAllSkillActionAsync,
} from "../../../redux/reducer/admin/studyReducer";

export default function CourseManagement() {
  const { loading, startLoading, stopLoading } = useLoading();
  const { apiCourse } = useSelector((state) => state.courseReducer);
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState(null);
  const [searchText, setSearchText] = useState(""); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalImageId, setModalImageId] = useState('');
  const handleImageClick = (id,image) => {
    setModalImage(image);  // Set hình ảnh vào modal
    setModalImageId(id);
    setIsModalVisible(true);  // Mở modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);  // Đóng modal
  };
  useEffect(() => {
    startLoading();
    dispatch(getAllCourseActionAsync()).finally(stopLoading);
    startLoading();
    dispatch(getAllFieldActionAsync()).finally(stopLoading);
    startLoading();
    dispatch(getAllSkillActionAsync()).finally(stopLoading);
  }, [dispatch, startLoading, stopLoading]);

  // Lọc dữ liệu theo title, bỏ qua khoảng trắng
  const filteredData = apiCourse?.filter((item) => {
    const normalizedTitle = item.title.toLowerCase().trim();
    const normalizedSearchText = searchText.toLowerCase().trim();
    return normalizedTitle.includes(normalizedSearchText) && item.status === 'PENDING';
  });

  

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: (
        <Space direction="vertical">
          <span>Title</span>

        </Space>
      ),
      dataIndex: "title",
      render: (text) => <a>{text}</a>,
      width: "20%",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      width: "100px",
      render: (owner) => <span>{owner?.email || "N/A"}</span>,
      width: "20%",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align:"center",
      width: "13%",
      render: (image, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={`http://localhost:8080/storage/course/${record.id}/${image}`}
              alt="Khóa học"
              style={{
                maxWidth: "80px",
                maxHeight: "80px",
                width: "100%",
                height: "auto",
                objectFit: "contain",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(record.id, record.image)}
            />
          </div>
        );
      },
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
    // {
    //   title: "Field",
    //   dataIndex: "fields",
    //   width: 120,
    //   render: (fields) =>
    //     fields && fields.length > 0 ? (
    //       fields.map((field) => (
    //         <Tag key={field.id} color="blue">
    //           {field.name}
    //         </Tag>
    //       ))
    //     ) : (
    //       <span>N/A</span>
    //     ),
    // },
    // {
    //   title: "Skill",
    //   dataIndex: "skills",
    //   render: (skills) =>
    //     skills && skills.length > 0 ? (
    //       skills.map((skill) => (
    //         <Tag key={skill.id} color="green">
    //           {skill.name}
    //         </Tag>
    //       ))
    //     ) : (
    //       <span>N/A</span>
    //     ),
    // },   
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      render: (status) => {
        let color;
        if (status === "PENDING") {
          color = "orange";
        } else if (status === "APPROVED") {
          color = "blue";
        } else {
          color = "red";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      width: "15%",
      render: (_, record) => <ActionButtons type="Course" record={record} />,
    },
  ];

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="div">
            <Input
              placeholder="Tìm theo tiêu đề..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ marginBottom: 16, width: 300 }}
            />
          </div>
          <Table
            className="admin-table"
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
          />
          <Modal
            open={isModalVisible}
            footer={null}
            onCancel={handleCancel}
            width="40%"
          >
            <img
              src={`http://localhost:8080/storage/course/${modalImageId}/${modalImage}`}
              alt="Khóa học"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Modal>
        </>
      )}
    </>
  );
  
}
