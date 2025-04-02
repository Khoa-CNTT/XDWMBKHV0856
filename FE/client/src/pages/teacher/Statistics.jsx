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

const Statistics = () => {
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Students",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(59, 130, 246, 0.6)", // primary color with opacity
      },
    ],
  };

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Course Completion Rate",
        data: [65, 59, 80, 81],
        fill: false,
        borderColor: "rgb(59, 130, 246)", // primary color
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Statistics</h1>
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
    </div>
  );
};

export default Statistics;
