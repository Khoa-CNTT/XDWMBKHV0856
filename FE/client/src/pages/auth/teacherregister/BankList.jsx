import React, { useEffect, useState } from "react";
import HandDataBank from "./HandDataBank";

function BankList({ onSelect, selectedBank, error }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBanks(HandDataBank);
    setLoading(false);
  }, []);

  if (loading) return <p>Đang tải danh sách ngân hàng...</p>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 max-h-72 ">
        {banks.map((bank, index) => {
          const isSelected = selectedBank?.short_name === bank.short_name;
          return (
            <button
              key={index}
              onClick={() => onSelect(bank)}
              className={`w-full h-12 rounded-lg overflow-hidden border transition-all duration-300 transform 
              hover:scale-105 hover:shadow-lg hover:bg-red-50
              ${
                isSelected
                  ? "border-red-500 bg-red-200 shadow-md"
                  : "border-gray-300 hover:bg-red-50 hover:border-red-300"
              }`}
            >
              <img
                src={bank.logo_url}
                alt={bank.short_name}
                className="w-full h-full object-contain p-2"
              />
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default BankList;
