import React, { useState } from "react";

const ProfileAndWallet = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "profile"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("wallet")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "wallet"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Wallet
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Profile Information
              </h2>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="123 Street, City"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Wallet</h2>

              {/* Balance Card */}
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
                <h3 className="text-lg font-medium mb-2">Available Balance</h3>
                <p className="text-3xl font-bold">$1,234.56</p>
              </div>

              {/* Recent Transactions */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          Transaction #{item}
                        </p>
                        <p className="text-sm text-gray-500">2024-01-{item}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">+$100.00</p>
                        <p className="text-sm text-gray-500">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Withdraw Button */}
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                  Withdraw Funds
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAndWallet;
