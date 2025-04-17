// src/layouts/WalletLayout.jsx
import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import TeacherLayout from "./TeacherLayout";

const WalletLayout = () => {
  const location = useLocation();

  return (
    <div className="mt-10">
      <div className="bg-white rounded-lg shadow-md ">
        {/* Wallet Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <Link
              to="/instructor/wallet/information"
              className={`${
                location.pathname === "/instructor/wallet/information"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Wallet Information
            </Link>
            <Link
              to="/instructor/wallet/history"
              className={`${
                location.pathname === "/instructor/wallet/history"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Transaction History
            </Link>
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WalletLayout;
