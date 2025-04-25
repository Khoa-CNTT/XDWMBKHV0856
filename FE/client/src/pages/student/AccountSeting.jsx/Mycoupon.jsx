import React, { useState, useEffect } from "react";
import { FiCopy, FiSearch } from "react-icons/fi";
import { format, isAfter } from "date-fns";
import { getUserCoupons } from "../../../services/coupon.services";
import { getCurrentUser } from "../../../services/auth.services";

const MyCoupons = () => {
    const [userId, setUserId] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("expires");
    const [copiedCode, setCopiedCode] = useState("");

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
        const fetchCoupons = async () => {
            if (!userId) return;

            try {
                const res = await getUserCoupons(userId);
                const couponsData = res.data.map((item) => {
                    const isPercent = item.coupon.discountType === "PERCENT";
                    const valueDisplay = isPercent
                        ? `${item.coupon.value}%`
                        : `${item.coupon.value.toLocaleString()} VND`;

                    return {
                        id: item.id,
                        headCode: item.coupon.headCode,
                        description: item.coupon.description,
                        value: valueDisplay,
                        rawValue: item.coupon.value,
                        discountType: item.coupon.discountType, // Thêm để sort chính xác
                        expiresAt: fixDateFormat(item.expiresAt),
                    };
                });
                setCoupons(couponsData);
            } catch (error) {
                console.error("Failed to fetch coupons:", error);
            }
        };

        fetchCoupons();
    }, [userId]);


    // Helper function to fix date format for valid Date object
    const fixDateFormat = (datetimeStr) => {
        const cleanStr = datetimeStr.replace(" PM", "").replace(" AM", "");
        return cleanStr.replace(" ", "T"); // Convert to ISO format
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(""), 2000);
    };

    const isExpired = (date) => {
        return !isAfter(new Date(date), new Date());
    };

    const filteredCoupons = coupons
        .filter((coupon) =>
            coupon.headCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "expires") {
                return new Date(a.expiresAt) - new Date(b.expiresAt);
            } else if (sortBy === "vnd") {
                // Ưu tiên FIXED, xếp từ lớn đến bé
                if (a.discountType === "FIXED" && b.discountType === "FIXED") {
                    return b.rawValue - a.rawValue;
                }
                if (a.discountType === "FIXED") return -1;
                if (b.discountType === "FIXED") return 1;
                return b.rawValue - a.rawValue; // So sánh PERCENT phía sau
            } else if (sortBy === "percent") {
                // Ưu tiên PERCENT, xếp từ lớn đến bé
                if (a.discountType === "PERCENT" && b.discountType === "PERCENT") {
                    return b.rawValue - a.rawValue;
                }
                if (a.discountType === "PERCENT") return -1;
                if (b.discountType === "PERCENT") return 1;
                return b.rawValue - a.rawValue; // So sánh FIXED phía sau
            }
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">My Coupons</h1>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search coupons..."
                                className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="expires">Sort by Expiration</option>
                            <option value="vnd">Sort by Discount Value VND</option>
                            <option value="percent">Sort by Discount Value % </option>
                        </select>
                    </div>
                </div>

                {filteredCoupons.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl text-gray-600">No coupons found</h2>
                        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCoupons.map((coupon) => {
                            const expired = isExpired(coupon.expiresAt);
                            return (
                                <div
                                    key={coupon.id}
                                    className={`relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${expired ? "opacity-75" : ""
                                        }`}
                                >
                                    {expired && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                            Expired
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {coupon.headCode}
                                            </h3>
                                            <button
                                                onClick={() => handleCopyCode(coupon.headCode)}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                                aria-label="Copy coupon code"
                                            >
                                                <FiCopy
                                                    className={`w-5 h-5 ${copiedCode === coupon.headCode
                                                        ? "text-red-500"
                                                        : "text-gray-400"
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {coupon.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-red-500">
                                                {coupon.value}
                                            </span>
                                            <span
                                                className={`text-sm ${expired ? "text-red-500" : "text-gray-500"
                                                    }`}
                                            >
                                                Expires: {format(new Date(coupon.expiresAt), "MMM dd, yyyy")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCoupons;
