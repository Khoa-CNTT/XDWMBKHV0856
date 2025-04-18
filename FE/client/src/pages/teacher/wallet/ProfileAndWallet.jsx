import React, { useState } from "react";
import { Eye, EyeOff, Pencil, Save } from "lucide-react";
import BankList from "../../auth/teacherregister/BankList";

const ProfileAndWallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showBankList, setShowBankList] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositError, setDepositError] = useState("");
  const [showDepositSuccessModal, setShowDepositSuccessModal] = useState(false);

  const [fullName] = useState("John Doe");
  const [bankAccount, setBankAccount] = useState("123456789");
  const [bankAccountError, setBankAccountError] = useState("");
  const [bank, setBank] = useState({
    short_name: "VCB",
    logo_url: "https://api.vietqr.io/img/VCB.png",
  });

  const [balance, setBalance] = useState(1230000);

  const handleSave = () => {
    if (!/^\d+$/.test(bankAccount)) {
      setBankAccountError("Only number");
      return;
    }
    setIsEditing(false);
    setShowBankList(false);
    setBankAccountError("");
    setShowVerifyModal(true);
  };

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (withdrawAmount === "" || isNaN(amount)) {
      setWithdrawError("hãy nhập lại!! chỉ nhập số");
    } else if (amount < 20000) {
      setWithdrawError("Minimum amount is 20,000");
    } else if (amount > balance) {
      setWithdrawError("Insufficient balance");
    } else {
      setBalance(balance - amount);
      setWithdrawError("");
      setWithdrawAmount("");
      setShowWithdrawModal(false);
      alert(`Withdraw ${amount.toLocaleString()} VND successfully!`);
    }
  };

  const handleDepositConfirm = () => {
    const amount = parseInt(depositAmount);
    if (depositAmount === "" || isNaN(amount)) {
      setDepositError("hãy nhập lại!! chỉ nhập số");
    } else if (amount < 20000) {
      setDepositError("Minimum amount is 20,000");
    } else {
      setBalance(balance + amount);
      setDepositError("");
      setDepositAmount("");
      setShowDepositModal(false);
      setShowDepositSuccessModal(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-10">
      {/* Wallet Section */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Available Balance</h3>
            <p className="text-3xl font-bold">
              {showBalance ? `${balance.toLocaleString()} VND` : "••••••"}
            </p>
          </div>
          <button onClick={() => setShowBalance(!showBalance)} className="ml-4">
            {showBalance ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              setWithdrawAmount("");
              setWithdrawError("");
              setShowWithdrawModal(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Withdraw Funds
          </button>
          <button
            onClick={() => {
              setDepositAmount("");
              setDepositError("");
              setShowDepositModal(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
          >
            Nạp tiền
          </button>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4">Withdraw Funds</h3>

            <div className="mb-4 space-y-2 text-sm text-gray-700">
              <div>
                <strong>Full Name:</strong> {fullName}
              </div>
              <div>
                <strong>Bank Account:</strong> {bankAccount}
              </div>
              <div className="flex items-center space-x-2">
                <strong>Bank:</strong>
                <img
                  src={bank.logo_url}
                  alt={bank.short_name}
                  className="h-5 w-auto"
                />
                <span>{bank.short_name}</span>
              </div>
            </div>

            <input
              type="text"
              className="w-full border rounded-lg p-2.5 mb-2"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (!/^\d*$/.test(val)) {
                  setWithdrawError("Only Number");
                } else {
                  setWithdrawError("");
                }
                setWithdrawAmount(val);
              }}
            />
            <div className="h-5 mb-2">
              {withdrawError && (
                <p className="text-red-500 text-sm">{withdrawError}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowWithdrawModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                onClick={handleWithdraw}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4">Nạp tiền</h3>

            <input
              type="text"
              className="w-full border rounded-lg p-2.5 mb-2"
              placeholder="Nhập số tiền muốn nạp"
              value={depositAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (!/^\d*$/.test(val)) {
                  setDepositError("Only Number");
                } else {
                  setDepositError("");
                }
                setDepositAmount(val);
              }}
            />
            <div className="h-5 mb-2">
              {depositError && (
                <p className="text-red-500 text-sm">{depositError}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowDepositModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                onClick={handleDepositConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thông báo nạp tiền thành công */}
      {showDepositSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md text-center">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              Nạp tiền thành công
            </h3>
            <p className="mb-6 text-gray-600">
              Số tiền bạn vừa nạp đã được cập nhật vào ví.
            </p>
            <button
              onClick={() => setShowDepositSuccessModal(false)}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            ---------------------------------------------------------------------------------------------------
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-600 hover:text-primary"
            title="Edit"
          >
            <Pencil size={25} />
          </button>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2.5 border rounded-lg bg-gray-100 cursor-not-allowed"
                value={fullName}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Number Account
              </label>
              <input
                type="text"
                className="w-full p-2.5 border rounded-lg bg-gray-100 cursor-not-allowed"
                value={bankAccount}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank
              </label>
              <div className="flex items-center space-x-3 p-2.5 border rounded-lg bg-gray-100">
                <img
                  src={bank.logo_url}
                  alt={bank.short_name}
                  className="h-6 w-auto"
                />
                <span>{bank.short_name}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 border rounded-lg bg-gray-100"
                  value={fullName}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Number Account
                </label>
                <input
                  type="text"
                  className={`w-full p-2.5 border rounded-lg ${
                    bankAccountError
                      ? "border-red-500"
                      : "focus:ring-2 focus:ring-primary focus:border-primary"
                  }`}
                  value={bankAccount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBankAccount(val);
                    setBankAccountError(/^\d*$/.test(val) ? "" : "Only number");
                  }}
                />
                <div className="h-5">
                  {bankAccountError && (
                    <p className="text-red-500 text-sm">{bankAccountError}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank
                </label>
                <button
                  onClick={() => setShowBankList(!showBankList)}
                  className="w-full p-2.5 border rounded-lg flex items-center space-x-3 hover:bg-gray-100"
                >
                  <img
                    src={bank.logo_url}
                    alt={bank.short_name}
                    className="h-6 w-auto"
                  />
                  <span>{bank.short_name}</span>
                </button>
                {showBankList && (
                  <div className="mt-3">
                    <BankList
                      selectedBank={bank}
                      onSelect={(b) => {
                        setBank(b);
                        setShowBankList(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                <Save size={18} className="mr-2" /> Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal xác nhận thông tin */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              Xác nhận thông tin
            </h3>
            <div className="space-y-3 mb-4 text-gray-700">
              <p>
                <strong>Full Name:</strong> {fullName}
              </p>
              <p>
                <strong>Bank Account:</strong> {bankAccount}
              </p>
              <p>
                <strong>Bank:</strong> {bank.short_name}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Hãy kiểm tra chính xác thông tin của bạn. Điều này sẽ giúp bạn
              nhận tiền nhanh chóng và tránh những sai sót không đáng có.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowVerifyModal(false)}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                onClick={() => {
                  setShowVerifyModal(false);
                  setShowSaveModal(true);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thông tin đã lưu */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md text-center">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              Thông tin đã được lưu
            </h3>
            <p className="mb-6 text-gray-600">
              Thông tin tài khoản ngân hàng của bạn đã được gửi đến admin.
            </p>
            <button
              onClick={() => setShowSaveModal(false)}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAndWallet;
