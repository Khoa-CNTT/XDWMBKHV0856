// src/layouts/WalletLayout.jsx
import React from "react";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import TeacherLayout from "./TeacherLayout";

const WalletLayout = () => {
  const location = useLocation();

  // Redirect mặc định nếu đang ở `/instructor/wallet`
  if (location.pathname === "/instructor/wallet") {
    return <Navigate to="/instructor/wallet/information" replace />;
  }

  return (
    <div className="mt-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Wallet Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav
            className="flex justify-center md:justify-start space-x-4 sm:space-x-6 px-6 py-3"
            aria-label="Tabs"
          >
            <Link
              to="/instructor/wallet/information"
              className={`transition-all duration-200 px-5 py-2.5 text-base font-semibold  ${
                location.pathname === "/instructor/wallet/information"
                  ? "bg-primary text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              Wallet Information
            </Link>
            <Link
              to="/instructor/wallet/history"
              className={`transition-all duration-200 px-5 py-2.5 text-base font-semibold  ${
                location.pathname === "/instructor/wallet/history"
                  ? "bg-primary text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              Transaction History
            </Link>
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WalletLayout;
