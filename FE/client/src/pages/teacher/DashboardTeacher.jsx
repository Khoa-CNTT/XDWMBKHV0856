import { getCourseById } from "../../services/course.services";
import { getCurrentUser } from "../../services/auth.services";
import React, { useState, useEffect } from "react";
import { FiBook, FiUsers, FiDollarSign, FiStar, FiChevronDown } from "react-icons/fi";
import { Line, Bar } from "react-chartjs-2";
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
import { format } from "date-fns";


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

const InstructorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedStudentYear, setSelectedStudentYear] = useState("2024");
  const [selectedStudentRange, setSelectedStudentRange] = useState("full");
  const [selectedRevenueRange, setSelectedRevenueRange] = useState("full");
  const [buyerPages, setBuyerPages] = useState({});

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [studentChange, setStudentChange] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        const data = await getCourseById(user.id);
        const courseList = data.result || [];
        setCourses(courseList);

        setTotalCourses(courseList.length);

        const students = courseList.reduce((sum, c) => sum + (c.studentQuantity || 0), 0);
        const reviews = courseList.reduce((sum, c) => sum + (c.totalRating || 0), 0);
        const avgRating = courseList.length
          ? (courseList.reduce((sum, c) => sum + c.overallRating, 0) / courseList.length).toFixed(1)
          : 0;

        setTotalStudents(students);
        setTotalReviews(reviews);
        setAverageRating(avgRating);

        // Gán giá trị tính toán này cho state nếu cần
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRevenueData = () => {
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const allData = [30000, 35000, 38000, 42000, 40000, 45000, 47000, 49000, 50000, 52000, 53000, 55000];

    let labels = allMonths;
    let data = allData;

    if (selectedRevenueRange === "first6") {
      labels = allMonths.slice(0, 6);
      data = allData.slice(0, 6);
    } else if (selectedRevenueRange === "last6") {
      labels = allMonths.slice(6);
      data = allData.slice(6);
    }

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          backgroundColor: "#4CAF50"
        }
      ]
    };
  };

  const getStudentData = () => {
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const allData = [800, 950, 1100, 1000, 1200, 1250, 1300, 1400, 1350, 1500, 1550, 1600];

    let labels = allMonths;
    let data = allData;

    if (selectedStudentRange === "first6") {
      labels = allMonths.slice(0, 6);
      data = allData.slice(0, 6);
    } else if (selectedStudentRange === "last6") {
      labels = allMonths.slice(6);
      data = allData.slice(6);
    }

    return {
      labels,
      datasets: [
        {
          label: "Students",
          data,
          borderColor: "#03A9F4",
          tension: 0.4
        }
      ]
    };
  };

  const purchaseHistory = [
    {
      id: 1,
      courseName: "Advanced React Development",
      date: "2024-01-15",
      price: 199,
      students: 45,
      buyers: [
        { email: "ad***@gmail.com", date: "2024-01-15", price: 199 },
        { email: "jo***@gmail.com", date: "2024-01-14", price: 199 },
        { email: "sm***@gmail.com", date: "2024-01-13", price: 199 }
      ]
    }
  ];

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className={`p-6 rounded-lg ${color} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? "text-chart-2" : "text-destructive"}`}>
              {change > 0 ? "+" : ""}{change}%
            </p>
          )}
        </div>
        <Icon className="text-4xl text-muted-foreground/50" />
      </div>
    </div>
  );

  const handlePageChange = (purchaseId, direction, totalBuyers) => {
    setBuyerPages(prev => {
      const currentPage = prev[purchaseId] || 1;
      const maxPage = Math.ceil(totalBuyers / 5);
      let newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
      if (newPage < 1) newPage = 1;
      if (newPage > maxPage) newPage = maxPage;
      return { ...prev, [purchaseId]: newPage };
    });
  };

  return (
    <div className="min-h-screen p-6 bg-background mt-11">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-heading font-heading">Instructor Dashboard</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard icon={FiBook} title="Total Courses" value={totalCourses} color="bg-card" />
              <StatCard icon={FiUsers} title="Current Students" value={totalStudents} change={studentChange} color="bg-card" />
              <StatCard icon={FiDollarSign} title="Monthly Revenue" value={`$${monthlyRevenue.toLocaleString()}`} change={revenueChange} color="bg-card" />
              <StatCard icon={FiStar} title="Total Reviews" value={totalReviews} color="bg-card" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Students Growth</h2>
                  <div className="flex gap-2">
                    <select
                      value={selectedStudentYear}
                      onChange={(e) => setSelectedStudentYear(e.target.value)}
                      className="px-3 py-1 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                    <select
                      value={selectedStudentRange}
                      onChange={(e) => setSelectedStudentRange(e.target.value)}
                      className="px-3 py-1 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="full">Full Year</option>
                      <option value="first6">First 6 Months</option>
                      <option value="last6">Last 6 Months</option>
                    </select>
                  </div>
                </div>
                <Line data={getStudentData()} options={{ responsive: true }} />
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Revenue Statistics</h2>
                  <div className="flex gap-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-3 py-1 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                    <select
                      value={selectedRevenueRange}
                      onChange={(e) => setSelectedRevenueRange(e.target.value)}
                      className="px-3 py-1 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="full">Full Year</option>
                      <option value="first6">First 6 Months</option>
                      <option value="last6">Last 6 Months</option>
                    </select>
                  </div>
                </div>
                <Bar data={getRevenueData()} options={{ responsive: true }} />
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              <h2 className="text-lg font-semibold p-6 border-b border-border">Recent Course Purchases</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Course Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Total Proceeds</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Students</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {purchaseHistory.map((purchase) => (
                      <React.Fragment key={purchase.id}>
                        <tr>
                          <td className="px-6 py-4 text-sm">{purchase.courseName}</td>
                          <td className="px-6 py-4 text-sm">{format(new Date(purchase.date), "MMM dd, yyyy")}</td>
                          <td className="px-6 py-4 text-sm">${purchase.price}</td>
                          <td className="px-6 py-4 text-sm">{purchase.students}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => setExpandedRow(expandedRow === purchase.id ? null : purchase.id)}
                              className="flex items-center text-primary hover:text-primary/80"
                            >
                              View Buyers
                              <FiChevronDown className={`ml-1 transform transition-transform ${expandedRow === purchase.id ? "rotate-180" : ""}`} />
                            </button>
                          </td>
                        </tr>
                        {expandedRow === purchase.id && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 bg-muted/20">
                              <div className="space-y-2">
                                {(() => {
                                  const currentPage = buyerPages[purchase.id] || 1;
                                  const startIndex = (currentPage - 1) * 5;
                                  const endIndex = startIndex + 5;
                                  const paginatedBuyers = purchase.buyers.slice(startIndex, endIndex);
                                  const totalPages = Math.ceil(purchase.buyers.length / 5);

                                  return (
                                    <>
                                      {paginatedBuyers.map((buyer, index) => (
                                        <div key={index} className="flex text-sm px-4">
                                          <span className="w-96">{buyer.email}</span>
                                          <span className="w-52">{format(new Date(buyer.date), "MMM dd, yyyy")}</span>
                                          <span className="">${buyer.price}</span>
                                        </div>
                                      ))}
                                      {totalPages > 1 && (
                                        <div className="flex justify-center gap-2">
                                          <button
                                            onClick={() => handlePageChange(purchase.id, "prev", purchase.buyers.length)}
                                            className="w-20 px-2 py-1 text-white border rounded disabled:opacity-50 bg-red-500"
                                            disabled={currentPage === 1}
                                          >
                                            Previous
                                          </button>
                                          <span className="px-2 py-1 text-sm">
                                            {currentPage} / {totalPages}
                                          </span>
                                          <button
                                            onClick={() => handlePageChange(purchase.id, "next", purchase.buyers.length)}
                                            className="w-20 px-2 py-1 text-gray-200 border rounded disabled:opacity-40 bg-red-500"
                                            disabled={currentPage === totalPages}
                                          >
                                            Next
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
