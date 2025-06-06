import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const TeacherLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith("/instructor/" + path)
      ? "bg-primary text-white"
      : "text-gray-300 hover:bg-primary/80 hover:text-white";
  };
  // if (location.pathname === "/instructor") {
  //   return <Navigate to="/instructor/dashboard" replace />;
  // }
  return (
    <div>
      <Header />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 shadow-md rounded-r-2xl">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Teacher Portal
            </h2>
          </div>
          <nav className="mt-4 flex flex-col space-y-1 px-2">
            <Link
              to="/instructor/dashboard"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out group ${isActive(
                "dashboard"
              )}`}
            >
              <svg
                className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/instructor/courses"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out group ${isActive(
                "courses"
              )}`}
            >
              <svg
                className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Courses
            </Link>
            {/* <Link
              to="/instructor/statistics"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out group ${isActive(
                "statistics"
              )}`}
            >
              <svg
                className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Statistics
            </Link> */}
            <Link
              to="/instructor/wallet"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out group ${isActive(
                "wallet"
              )}`}
            >
              <svg
                className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              My Wallet
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TeacherLayout;
