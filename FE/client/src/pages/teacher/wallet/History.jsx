import React, { useEffect, useState } from "react";
import WalletLayout from "../../../components/common/Layout/WalletLayout";
import { getCurrentUser } from "../../../services/auth.services";
import { getSeveralWithdraw } from "../../../services/wallet.services";

const History = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [userId, setUserId] = useState(null);

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
        const data = await getSeveralWithdraw([userId]); // Truyền vào mảng ID
        setWithdraws(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách rút tiền:", error);
      }
    };

    fetchWithdraws();
  }, [userId]);

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
            <div className="space-y-4">
              {withdraws.map((item) => (
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
          )}
        </div>

        {/* Bạn có thể bật phân trang thật nếu backend hỗ trợ */}
      </div>
    </div>
  );
};

export default History;
