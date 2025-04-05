import React from "react";
import { Card, Statistic, Table, Tag } from "antd";
import { DollarCircleOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Đảm bảo import đầy đủ

const Dashboard = () => {
  const revenueData = [
    { month: "Tháng 1", revenue: 5000 },
    { month: "Tháng 2", revenue: 7000 },
    { month: "Tháng 3", revenue: 12000 },
    { month: "Tháng 4", revenue: 15000 },
    { month: "Tháng 5", revenue: 11000 },
  ];

  const topCourses = [
    { id: 1, name: "React Mastery", sales: 150, category: "Frontend" },
    { id: 2, name: "Node.js Ultimate Guide", sales: 120, category: "Backend" },
    { id: 3, name: "UI/UX Design Fundamentals", sales: 100, category: "Design" },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Thống kê tổng quan */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <Card style={{ flex: 1 }}>
          <Statistic
            title="Doanh thu tháng này"
            value={15000}
            prefix={<DollarCircleOutlined />}
            suffix="VNĐ"
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <Card style={{ flex: 1 }}>
          <Statistic
            title="Học viên mới"
            value={120}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
        <Card style={{ flex: 1 }}>
          <Statistic
            title="Khóa học đã bán"
            value={300}
            prefix={<BookOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </div>

      {/* Biểu đồ doanh thu */}
      <Card title="Thống kê doanh thu" style={{ marginBottom: 20 }}>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#1890ff" dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Danh sách khóa học bán chạy */}
      <Card title="Top khóa học bán chạy">
        <Table
          dataSource={topCourses}
          columns={[
            { title: "ID", dataIndex: "id", key: "id" },
            { title: "Tên khóa học", dataIndex: "name", key: "name" },
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
