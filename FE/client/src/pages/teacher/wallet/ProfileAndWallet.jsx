import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Pencil, Save, ArrowLeft } from "lucide-react";
import BankList from "../../auth/teacherregister/BankList";
import { getWallet } from "../../../services/wallet.services";
import { getCurrentUser } from "../../../services/auth.services";
import { updateWallet } from "../../../services/wallet.services";
import { createWithdrawRequest } from "../../../services/wallet.services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileAndWallet = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showBankList, setShowBankList] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositError, setDepositError] = useState("");
  const [showDepositSuccessModal, setShowDepositSuccessModal] = useState(false);

  const [walletId, setWalletId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [originalBankAccount, setOriginalBankAccount] = useState("");
  const [originalBank, setOriginalBank] = useState(null);
  const [bankAccountError, setBankAccountError] = useState("");
  const [bank, setBank] = useState({
    short_name: "",
    logo_url: "",
  });

  const [balance, setBalance] = useState();

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
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        const wallet = await getWallet(user.id);

        setFullName(wallet.accountName);
        setBankAccount(wallet.accountNumber);
        setOriginalBankAccount(wallet.accountNumber);
        setWalletId(wallet.id); // Lưu wallet.id tại đây

        const bankData = {
          short_name: wallet.bank,
          logo_url: `https://api.vietqr.io/img/${wallet.bank}.png`,
        };
        setBank(bankData);
        setOriginalBank(bankData);
        setBalance(wallet.balance);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu profile/wallet:", err);
      }
    };

    fetchData();
  }, []);

  const handleSave = () => {
    if (!/^\d+$/.test(bankAccount)) {
      setBankAccountError("Only number");
      return;
    }
    const hasChanged =
      bankAccount !== originalBankAccount;

    if (!hasChanged) {
      toast.info("You haven't changed any information.");
      return;
    }
    setIsEditing(false);
    setShowBankList(false);
    setBankAccountError("");
    setShowVerifyModal(true);
  };

  const handleUpdateWallet = async () => {
    try {
      await updateWallet(walletId, {
        account: bankAccount,
        bank: bank.code,
      });

      toast.success("Wallet updated successfully!");
      setOriginalBankAccount(bankAccount);
      setOriginalBank(bank);
      setIsEditing(false);
      setShowVerifyModal(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật ví:", err);
      toast.error("Failed to update wallet!");
      setShowVerifyModal(false);
      // Khôi phục lại dữ liệu gốc nếu thất bại
      setBankAccount(originalBankAccount);
      setBank(originalBank);
      setIsEditing(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);

    if (withdrawAmount === "" || isNaN(amount)) {
      setWithdrawError("Please enter a valid number.");
    } else if (amount < 20000) {
      setWithdrawError("Minimum withdraw amount is 20,000.");
    } else if (amount > balance) {
      setWithdrawError("Insufficient balance.");
    } else {
      try {
        // Gửi yêu cầu rút tiền
        await createWithdrawRequest({
          amount: amount,
          wallet: {
            id: walletId,
          },
        });

        // Nếu thành công, cập nhật UI
        setBalance(balance - amount);
        setWithdrawError("");
        setWithdrawAmount("");
        setShowWithdrawModal(false);
        toast.success(`Withdraw request for ${amount.toLocaleString()} VND sent successfully!`);
      } catch (error) {
        console.error("Lỗi khi rút tiền:", error);
        setWithdrawError("Withdrawal failed, please try again.");
        toast.error("Withdrawal request failed.");
      }
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
          <h2 className="text-2xl font-semibold text-gray-800">Bank account information</h2>
          <div className="relative group">
            <button
              onClick={() => {
                if (!bankAccountError) {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }
              }}
              disabled={!!bankAccountError}
              className="text-gray-600 hover:text-primary disabled:text-gray-400"
              title={
                bankAccountError
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
                onClick={() => {
                  setBankAccount(originalBankAccount);
                  setBank(originalBank);
                  setIsEditing(false);
                }}
                className="ml-2 text-gray-600 hover:text-primary"
                title="Go Back"
              >
                <ArrowLeft size={25} />
              </button>
            )}
            {(bankAccountError) && (
              <div className="absolute -top-10 right-0 bg-black text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-64 text-center z-50">
                Hãy Nhập Lại Chính Xác
              </div>
            )}

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account’s name
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
                Account’s number
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
                Account’s number
              </label>
              <input
                type="text"
                className={`w-full p-2.5 border rounded-lg ${bankAccountError
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
              <div className="flex items-center space-x-1 p-2.5 border rounded-lg bg-gray-100">
                <img
                  src={bank.logo_url || "/fallback-logo.png"}
                  alt={bank.short_name || "Bank"}
                  className="h-10 w-auto"
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
                    className="h-10 w-auto"
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
              <p className="text-base">
                <strong>Bank Account:</strong> {bankAccount}
              </p>
              <p className="flex items-center gap-2">
                <strong className="text-base">Bank:</strong>
                <img
                  src={bank.logo_url}
                  alt={bank.short_name}
                  className="h-9 w-auto"
                />
                {bank.short_name}
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setBankAccount(originalBankAccount);
                  setBank(originalBank);
                  setIsEditing(false);
                  setShowVerifyModal(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateWallet}
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
