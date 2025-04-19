import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardTeacher = () => {
  // Data for bar chart
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Students",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(255, 0, 0, 0.8)", // primary color with opacity rgba(59, 130, 246, 0.6)
      },
    ],
  };

  // Data for line chart
  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Course Completion Rate",
        data: [65, 59, 80, 81],
        fill: false,
        borderColor: "red", // primary color rgb(59, 130, 246)
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      {/* Teacher Dashboard Overview */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Teacher Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-primary">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Courses Overview
          </h2>
          <p className="text-3xl font-bold text-primary">5</p>
          <p className="text-gray-600">Total Courses</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-primary">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Students</h2>
          <p className="text-3xl font-bold text-primary">120</p>
          <p className="text-gray-600">Active Students</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-primary">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue</h2>
          <p className="text-3xl font-bold text-primary">$1,234</p>
          <p className="text-gray-600">This Month</p>
        </div>
      </div>

      {/* Statistics */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 mt-10">
        {/* Statistics */}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            New Students
          </h2>
          <Bar data={barChartData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Course Completion Rate
          </h2>
          <Line data={lineChartData} />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Students
          </h2>
          <p className="text-3xl font-bold text-primary">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Average Rating
          </h2>
          <p className="text-3xl font-bold text-primary">4.7</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Courses
          </h2>
          <p className="text-3xl font-bold text-primary">15</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Activities
        </h2>
        <ul className="space-y-4">
          <li className="flex items-center">
            <span className="bg-primary bg-opacity-10 text-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              New
            </span>
            <p className="text-gray-600">New enrollment in "React Basics"</p>
          </li>
          <li className="flex items-center">
            <span className="bg-primary bg-opacity-10 text-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              Review
            </span>
            <p className="text-gray-600">
              3 new reviews on "Advanced JavaScript"
            </p>
          </li>
          <li className="flex items-center">
            <span className="bg-primary bg-opacity-10 text-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              Update
            </span>
            <p className="text-gray-600">
              Updated content in "Python for Beginners"
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardTeacher;
