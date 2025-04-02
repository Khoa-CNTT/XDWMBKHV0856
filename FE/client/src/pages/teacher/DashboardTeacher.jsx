import React from "react";

const DashboardTeacher = () => {
  return (
    <div>
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
