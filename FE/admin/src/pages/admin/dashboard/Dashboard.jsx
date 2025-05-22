import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Table, Tag, Typography } from "antd";
import React from "react";
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

const { Title, Text } = Typography;
const topCourses = [
  { id: 1, name: "React Mastery", sales: 150, category: "Frontend" },
  { id: 2, name: "Node.js Ultimate Guide", sales: 120, category: "Backend" },
  { id: 3, name: "UI/UX Design Fundamentals", sales: 100, category: "Design" },
];

// Thay đổi phần stats, bỏ "Students" và "Instructors", thay bằng "Courses Sold"
const stats = [
  {
    title: "Total Revenue",
    value: "$48,900",
    change: "+12.6%",
    up: true,
  },
  {
    title: "Total Users",
    value: "2,430",
    change: "+3.2%",
    up: true,
  },
  {
    title: "Courses Sold",
    value: "1,320",
    change: "+8.7%",
    up: true,
  },
];

const pieData = [
  { name: "React", value: 400 },
  { name: "Node.js", value: 300 },
  { name: "UX/UI", value: 300 },
  { name: "Python", value: 200 },
  { name: "AI", value: 100 },
];

const pieColors = ["#6366F1", "#F43F5E", "#22D3EE", "#FACC15", "#22C55E"];

const lineData = [
  { name: "Jan", value: 6000 },
  { name: "Feb", value: 7500 },
  { name: "Mar", value: 9000 },
  { name: "Apr", value: 11000 },
  { name: "May", value: 14000 },
];

const Dashboard = () => {
  // const meta = useSelector(state => state.userReducer.meta) || []
  // console.log(`${meta.totalElement}`)
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(getAllUserActionAsync())
  // },[])
  return (
    <div style={{ padding: 24 }}>
      {/* Stats */}
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

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Revenue by Category">
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
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
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
                      backgroundColor: pieColors[index],
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

      <Card title="Top khóa học bán chạy">
        <Table
          dataSource={topCourses}
          columns={[
            { title: "ID", dataIndex: "id", key: "id" },
            {
              title: "Tên khóa học",
              dataIndex: "name",
              key: "name",
              render: (name, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={`https://i.pravatar.cc/100?img=${record.id}`} // Bạn có thể thay đổi link hình ảnh tùy ý
                    alt={name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: 10,
                    }}
                  />
                  <span>{name}</span>
                </div>
              ),
            },
            {
              title: "Danh mục",
              dataIndex: "category",
              key: "category",
              render: (category) => <Tag color="blue">{category}</Tag>,
            },
            { title: "Lượt mua", dataIndex: "sales", key: "sales" },
          ]}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default Dashboard;
