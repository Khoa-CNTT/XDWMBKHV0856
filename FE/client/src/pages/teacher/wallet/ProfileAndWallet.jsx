import React, { useState } from "react";
import { Eye, EyeOff, Pencil, Save, ArrowLeft } from "lucide-react";
import BankList from "../../auth/teacherregister/BankList";

const ProfileAndWallet = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showBankList, setShowBankList] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositError, setDepositError] = useState("");
  const [showDepositSuccessModal, setShowDepositSuccessModal] = useState(false);

  const [fullName, setFullName] = useState("John Doe");
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
    if (fullName === "John Doe" && bankAccount === "123456789") {
      alert("Bạn vẫn chưa thay đổi thông tin");
      return;
    }
    setIsEditing(false);
    setShowBankList(false);
    setBankAccountError("");
    setShowVerifyModal(true);
    setIsLocked(true);
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

  return (
    <div className=" rounded-lg shadow space-y-10 bg-red-50">
      {/* Wallet Section */}
      <div className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-md">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Available Balance</h3>
            <p className="text-3xl font-bold">
              {showBalance ? `${balance.toLocaleString()} VND` : "**********"}
            </p>
          </div>
          <button onClick={() => setShowBalance(!showBalance)} className="ml-4">
            {showBalance ? <Eye size={24} /> : <EyeOff size={24} />}
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

      {/* Profile Section */}
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
          <div className="relative group">
            <button
              onClick={() => {
                if (!isLocked && !bankAccountError) {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }
              }}
              disabled={isLocked || !!bankAccountError}
              className="text-gray-600 hover:text-primary disabled:text-gray-400"
              title={
                isLocked
                  ? ""
                  : bankAccountError
                  ? "Hãy Nhập Lại Chính Xác"
                  : isEditing
                  ? "Save"
                  : "Edit"
              }
            >
              {isEditing ? <Save size={25} /> : <Pencil size={25} />}
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 text-gray-600 hover:text-primary"
                title="Go Back"
              >
                <ArrowLeft size={25} />
              </button>
            )}
            {(isLocked || bankAccountError) && (
              <div className="absolute -top-10 right-0 bg-black text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-64 text-center z-50">
                {isLocked
                  ? "bạn đã chỉnh sửa, chờ admin xác nhận"
                  : "Hãy Nhập Lại Chính Xác"}
              </div>
            )}
          </div>
        </div>

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

          {!isEditing ? (
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
          ) : (
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
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank
            </label>
            {!isEditing ? (
              <div className="flex items-center space-x-3 p-2.5 border rounded-lg bg-gray-100">
                <img
                  src={bank.logo_url}
                  alt={bank.short_name}
                  className="h-6 w-auto"
                />
                <span>{bank.short_name}</span>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal xác nhận thông tin */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md text-center">
            <h3 className="text-xl font-semibold mb-4">Confirm Information</h3>
            <p className="mb-4 text-gray-700">
              Please check your updated information below:
            </p>

            <div className="text-left space-y-2 text-sm text-gray-700 mb-4 border p-4 rounded-lg bg-gray-50">
              <p>
                <strong>Full Name:</strong> {fullName}
              </p>
              <p>
                <strong>Bank Account:</strong> {bankAccount}
              </p>
              <p className="flex items-center gap-2">
                <strong>Bank:</strong>
                <img
                  src={bank.logo_url}
                  alt={bank.short_name}
                  className="h-5 w-auto"
                />
                {bank.short_name}
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Không reset isLocked nữa
                  setShowVerifyModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAndWallet;
