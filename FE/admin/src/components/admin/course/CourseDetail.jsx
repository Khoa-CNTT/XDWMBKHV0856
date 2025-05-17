import {
  BookOutlined,
  DollarOutlined,
  FileImageOutlined,
  FileOutlined,
  FileTextOutlined,
  ReadOutlined,
  TagOutlined,
  ToolOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Card, Col, Input, Row, Tag } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDetailCourseActionAsync } from "../../../redux/reducer/admin/courseReducer";
import ContentCourse from "../ContentCourse";

const CourseDetail = ({ id }) => {
  const { detailCourse } = useSelector((state) => state.courseReducer || []);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDetailCourseActionAsync(id));
  }, []);
  return (
    <Card className="p-4 shadow-sm card-custom">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <div className="card-item">
            <div className="d-flex align-items-center label-title">
              <BookOutlined className="me-2" style={{ fontSize: "20px" }} />
              <span>Course ID</span>
            </div>
            <Input value={detailCourse.id} readOnly className="ant-input" />
          </div>
          <div className="card-item">
            <div className="d-flex align-items-center label-title">
              <DollarOutlined className="me-2" style={{ fontSize: "20px" }} />
              <span>Price</span>
            </div>
            <Input
              value={new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
              }).format(detailCourse.price)}
              readOnly
              className="ant-input"
            />
          </div>
          <div className="card-item">
            <div className="d-flex align-items-center label-title">
              <UserOutlined className="me-2" style={{ fontSize: "20px" }} />
              <span>Owner</span>
            </div>
            <Input
              value={detailCourse.owner?.email}
              readOnly
              className="ant-input"
            />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="card-item">
            <div className="d-flex label-title mb-2">
              <FileImageOutlined className="me-2" style={{ fontSize: "20px" }} />
              <div>Course Image</div>
            </div>
            <img
              src={`http://localhost:8080/storage/course/${detailCourse.id}/${detailCourse.image}`}
              alt="Course"
              className="img-fluid rounded shadow-sm course-image"
            />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="card-item">
            <div className="d-flex align-items-center label-title">
              <FileTextOutlined className="me-2" style={{ fontSize: "20px" }} />
              <span>Description</span>
            </div>
            <Input.TextArea
              value={detailCourse.description}
              readOnly
              autoSize
              className="ant-input-textarea"
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="card-item">
            <div className="d-flex align-items-center label-title">
              <FileOutlined className="me-2" style={{ fontSize: "20px" }} />
              <span>Introduce</span>
            </div>
            <Input.TextArea
              value={detailCourse.shortIntroduce}
              readOnly
              autoSize
              className="ant-input-textarea"
            />
          </div>
        </Col>

        <Col xs={12}>
          <div className="card-item">
            <div className="d-flex align-items-center">
            <TagOutlined className="me-2" style={{ fontSize: "20px" }} />
              <span className="label-title">Fields</span>
            </div>
            <div className="tags-wrapper">
              {detailCourse.fields?.length > 0 ? (
                detailCourse.fields.map((field, index) => (
                  <Tag
                    key={index}
                    color="magenta"
                    className="px-2 py-1 border rounded-pill ant-input"
                  >
                    {field.name}
                  </Tag>
                ))
              ) : (
                <span>N/A</span>
              )}
            </div>
          </div>
        </Col>

        <Col xs={12}>
          <div className="card-item">
            <div className="d-flex align-items-center">
            <ToolOutlined className="me-2" style={{ fontSize: "20px" }} />
              <span className="label-title">Skills</span>
            </div>
            <div className="tags-wrapper">
              {detailCourse.fields?.length > 0 ? ( // Nếu có field nào
                detailCourse.fields.flatMap((field) => field.skills || [])
                  .length > 0 ? ( // Nếu có skill trong các field
                  detailCourse.fields
                    .flatMap((field) => field.skills || [])
                    .map((skill, index) => (
                      <Tag
                        key={index}
                        color="volcano"
                        className="px-2 py-1 border rounded-pill ant-input"
                      >
                        {skill.name}
                      </Tag>
                    ))
                ) : (
                  <span>N/A</span> // Không có skill
                )
              ) : (
                <span>N/A</span> // Không có field
              )}
            </div>
          </div>
        </Col>
        <Col xs={24}>
          <div className="card-item">
            <div className="d-flex align-items-center label-title">
            <ReadOutlined className="me-2" style={{ fontSize: "20px" }} />
              <span>Content Course</span>
            </div>
            <ContentCourse
              chapters={detailCourse.chapters}
              id={detailCourse.id}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default CourseDetail;
