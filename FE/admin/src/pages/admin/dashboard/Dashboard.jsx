import {
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Table,
  Typography
} from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAllCourseActionAsync } from "../../../redux/reducer/admin/courseReducer";
import { getAllUserActionAsync } from "../../../redux/reducer/admin/userReducer";
import { VITE_AVATAR_URL, VITE_COURSE_IMAGE_URL } from "../../../setting/api";

const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();

  const userApi = useSelector((state) => state.userReducer.userApi) || [];
  const apiCourse = useSelector((state) => state.courseReducer.apiCourse) || [];

  useEffect(() => {
    dispatch(getAllUserActionAsync({ page: 1, size: 999 }));
    dispatch(getAllCourseActionAsync());
  }, [dispatch]);

  // Tính toán role count
  const roleCounts = userApi.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      title: "Total Users",
      value: `${userApi.length}`,
      change: "+3.2%",
      up: true,
    },
    {
      title: "Courses Available",
      value: `${apiCourse.length}`,
      change: "+8.7%",
      up: true,
    },
    {
      title: "Admin Accounts",
      value: `${roleCounts.ADMIN || 0}`,
      change: "-1.2%",
      up: false,
    },
  ];

  const pieData = Object.entries(roleCounts).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  const pieColors = ["#6366F1", "#F43F5E", "#22D3EE", "#FACC15", "#22C55E"];

  const lineData = [
    { name: "Jan", value: 6000 },
    { name: "Feb", value: 7500 },
    { name: "Mar", value: 9000 },
    { name: "Apr", value: 11000 },
    { name: "May", value: 14000 },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card>
              <Title level={4}>{stat.title}</Title>
              <Text strong style={{ fontSize: 20 }}>
                {stat.value}
              </Text>
              <br />
              <Text type={stat.up ? "success" : "danger"}>
                {stat.up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
                {stat.change}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="User Roles Breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  innerRadius={60}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16 }}>
              {pieData.map((item, index) => (
                <div key={index}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      backgroundColor: pieColors[index % pieColors.length],
                      marginRight: 8,
                    }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Monthly Revenue">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={lineData}
                margin={{ top: 5, right: 20, bottom: 5, left: -10 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16 }}>
              <Title level={4}>$48,900</Title>
              <Text type="success">+12.6%</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Danh sách khóa học Gần đây" style={{ marginTop: 24 }}>
        <Table
          rowKey="id"
          dataSource={apiCourse}
          columns={[
            {
              title: "Image",
              dataIndex: "image",
              render: (img,record) => (
                <img
                  src={`${VITE_COURSE_IMAGE_URL}/${record.id}/${img}`}
                  alt="course"
                  style={{ width: 60, height: 40, objectFit: "cover" }}
                />
              ),
            },
            {
              title: "Tên khóa học",
              dataIndex: "title",
              render: (text) => (
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 200, 
                  }}
                  title={text} 
                >
                  {text}
                </div>
              ),
            }
            ,
            
            {
              title: "Owner",
              dataIndex: "owner",
              render: (owner) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {owner?.avatar ? (
                    <img
                      src={`${VITE_AVATAR_URL}/${owner.id}/${owner.avatar}`}
                      alt="avatar"
                      style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#ccc",
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{owner?.email}</div>
                  </div>
                </div>
              ),
            }
            
            
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
