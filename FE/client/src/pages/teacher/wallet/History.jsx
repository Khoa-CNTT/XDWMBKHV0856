import React, { useEffect, useState } from "react";
import WalletLayout from "../../../components/common/Layout/WalletLayout";
import { getCurrentUser } from "../../../services/auth.services";
import { getSeveralWithdraw } from "../../../services/wallet.services";

const ITEMS_PER_PAGE = 5;

const History = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.id);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchWithdraws = async () => {
      if (!userId) return;
      try {
        const data = await getSeveralWithdraw([userId]);
        // Đảo ngược danh sách để hiển thị giao dịch mới nhất trước
        setWithdraws([...data].reverse());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách rút tiền:", error);
      }
    };

    fetchWithdraws();
  }, [userId]);

  // Pagination logic
  const totalPages = Math.ceil(withdraws.length / ITEMS_PER_PAGE);
  const paginatedWithdraws = withdraws.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-6">Transaction History</h1>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Recent Transactions
          </h3>

          {withdraws.length === 0 ? (
            <p className="text-gray-500">Chưa có giao dịch nào.</p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedWithdraws.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.wallet.accountName} - {item.wallet.bank}
                      </p>
                      <p className="text-sm text-gray-500">{item.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {item.amount.toLocaleString()} VND
                      </p>
                      <p
                        className={`text-sm ${item.orderStatus === "PENDING"
                          ? "text-yellow-500"
                          : "text-green-600"
                          }`}
                      >
                        {item.orderStatus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  prev
                </button>
                <span className="text-gray-700">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
