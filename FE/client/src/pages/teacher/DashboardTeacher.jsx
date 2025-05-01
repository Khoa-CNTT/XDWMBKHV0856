import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { FiUsers, FiBook, FiDollarSign, FiStar } from "react-icons/fi";
import { FaChartLine } from "react-icons/fa";
import { getCourseById } from "../../services/course.services";
import { getCurrentUser } from "../../services/auth.services";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeacherDashboard = () => {
  const [viewType, setViewType] = useState("monthly");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser(); // Lấy user hiện tại
        const data = await getCourseById(user.id); // Truy xuất các khóa học theo owner.id
        setCourses(data.result || []);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const overviewData = [
    {
      title: "Total Courses",
      value: courses.length,
      icon: <FiBook className="w-6 h-6" />,
      change: "" // Bạn có thể thêm logic so sánh với tháng trước nếu có
    },
    {
      title: "Active Students",
      value: courses.reduce((total, course) => total + course.studentQuantity, 0),
      icon: <FiUsers className="w-6 h-6" />,
      change: ""
    },
    {
      title: "Monthly Revenue",
      value: `$${courses.reduce((sum, course) => sum + course.price, 0).toLocaleString()}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      change: ""
    },
    {
      title: "Average Rating",
      value: (courses.length > 0
        ? (courses.reduce((sum, c) => sum + c.overallRating, 0) / courses.length).toFixed(1)
        : "0.0"),
      icon: <FiStar className="w-6 h-6 text-yellow-500" />,
      change: ""
    }
  ];


  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "New Students",
      data: [65, 59, 80, 81, 56, 195],
      backgroundColor: "#E11D48"
    }]
  };

  const monthlyRevenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Monthly Revenue",
      data: [3000, 3500, 4200, 4800, 5100, 5600, 6200, 6800, 7100, 7500, 8000, 10500],
      borderColor: "#E11D48",
      backgroundColor: "rgba(225, 29, 72, 0.1)",
      tension: 0.4
    }]
  };

  const weeklyRevenueData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      label: "Weekly Revenue",
      data: [1200, 1800, 2100, 2400],
      borderColor: "#03A9F4",
      backgroundColor: "rgba(3, 169, 244, 0.1)",
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end"
      },
      tooltip: {
        backgroundColor: "#FFFFFF",
        titleColor: "#020817",
        bodyColor: "#020817",
        borderColor: "#E0E0E0",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Revenue: $${context.parsed.y}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#F0F1F3" },
        ticks: {
          callback: (value) => `$${value}`
        }
      },
      x: {
        grid: { color: "#F0F1F3" }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-heading font-heading text-foreground mb-8">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewData.map((item, index) => (
          <div key={index} className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-accent">{item.icon}</div>
              <span className="text-sm text-green-500">{item.change}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="text-2xl font-bold text-primary mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* New Students Trend */}
        <div className="bg-card p-6 rounded-lg shadow-sm h-[500px] flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-4">New Students Trend</h3>
          <div className="h-full">
            <Bar data={barChartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Revenue Statistics */}
        <div className="bg-card p-6 rounded-lg shadow-sm h-[500px] flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-primary text-xl" />
              <h3 className="text-lg font-semibold text-foreground">Revenue Statistics</h3>
            </div>
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewType("monthly")}
                className={`px-4 py-2 rounded-md transition-all ${viewType === "monthly" ? "bg-white text-primary shadow-sm" : "text-accent-foreground"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setViewType("weekly")}
                className={`px-4 py-2 rounded-md transition-all ${viewType === "weekly" ? "bg-white text-primary shadow-sm" : "text-accent-foreground"}`}
              >
                Weekly
              </button>
            </div>
          </div>
          <div className="h-full">
            <Line
              data={viewType === "monthly" ? monthlyRevenueData : weeklyRevenueData}
              options={{ ...revenueChartOptions, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
