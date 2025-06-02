import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaCalendarAlt,
  FaUserGraduate,
  FaSearch,
  FaCreditCard,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { ReviewModal } from "./ReviewModal";
import { useMyOrder } from "../../../contexts/MyOrderContext";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const ITEMS_PER_PAGE = 6;

const CoursePurchaseHistory = () => {
  const { myOrders } = useMyOrder();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let filtered = myOrders.filter((order) => order.status !== "PENDING");
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.course.owner?.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.orderCode.toString().includes(searchTerm)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (dateFilter !== "all") {
      const now = new Date();
      let filterDate = new Date();
      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      filtered = filtered.filter((order) => {
        // Parse createdAt, ignore time and AM/PM
        const dateStr = order.createdAt.split(" ")[0];
        // Format: YYYY-MM-DD
        const dateParts = dateStr.split("-");
        if (dateParts.length === 3) {
          // new Date(year, monthIndex, day)
          const createdDate = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
          // Compare only date (ignore time)
          return createdDate >= filterDate;
        }
        return false;
      });
    }
    setFilteredOrders(filtered);
  }, [myOrders, searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [filteredOrders]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getTotalSpent = () => {
    return myOrders
      .filter((order) => order.status === "PAID")
      .reduce((total, order) => total + order.course.price, 0);
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Purchased Courses</h1>
          <p className="text-muted-foreground">
            Manage and track your purchased courses
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FaCreditCard className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(getTotalSpent())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FaCheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Courses Purchased
                  </p>
                  <p className="text-2xl font-bold">{myOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search courses, instructors, or order code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Course List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FaSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your search criteria"
                    : "You haven't purchased any courses yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {getCurrentPageItems()?.map((myOrder) => {
                return (
                  <motion.div
                    key={myOrder.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-card rounded-lg overflow-hidden shadow-lg border border-border"
                  >
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Image */}
                      <div className="md:w-1/3 relative flex-shrink-0 flex items-center justify-center bg-white">
                        <img
                          src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${
                            myOrder.course.id
                          }/${myOrder.course.image}`}
                          alt={myOrder.course.title}
                          className="w-full h-48 md:h-56 object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-md text-base font-semibold shadow">
                          {formatCurrency(myOrder.course.price)}
                        </div>
                      </div>
                      {/* Info */}
                      <div className="flex flex-col justify-between p-6 md:w-2/3 h-full">
                        {/* Top: Title, desc, order code */}
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <h3
                              className="text-2xl font-bold line-clamp-2"
                              title={myOrder.course.title}
                            >
                              {myOrder.course.title}
                            </h3>
                            <span className="text-sm text-muted-foreground md:ml-4 whitespace-nowrap">
                              Order #{myOrder.orderCode}
                            </span>
                          </div>
                          <p className="text-base text-muted-foreground line-clamp-2 mb-4">
                            {myOrder.course.shortIntroduce}
                          </p>
                        </div>
                        {/* Middle: Info row */}
                        <div className="flex flex-wrap gap-4 items-center mb-4 justify-between">
                          <div className="flex items-center text-sm min-w-[120px]">
                            <FaUserGraduate className="mr-2 text-primary" />
                            <span
                              className="truncate"
                              title={myOrder.course.owner?.fullName}
                            >
                              {myOrder.course.owner?.fullName}
                            </span>
                          </div>
                          <div className="flex items-center text-sm min-w-[120px]">
                            <FaCalendarAlt className="mr-2 text-primary" />
                            <span>{myOrder.createdAt.split(" ")[0]}</span>
                          </div>
                          <div className="flex items-center text-sm min-w-[100px]">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                myOrder.status === "PAID"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {myOrder.status === "PAID" ? "Paid" : "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm flex-wrap gap-2">
                            {(myOrder.course.fields || []).map((field) => (
                              <span
                                key={field.id}
                                className="text-xs px-2 py-1 bg-muted rounded-full"
                              >
                                {field.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Bottom: Actions */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
                          <div className="flex items-center space-x-4">
                            {myOrder.userReview ? (
                              <div className="flex items-center">
                                {[...Array(5)].map((_, index) => (
                                  <FaStar
                                    key={index}
                                    className={`${
                                      index < myOrder.userReview.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    } text-sm`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <button
                                className="text-primary hover:text-primary-dark text-sm font-medium"
                                onClick={() => {
                                  setSelectedCourse(myOrder.course);
                                  setIsReviewModalOpen(true);
                                }}
                              >
                                Add Review
                              </button>
                            )}
                          </div>
                          <div className="flex-1 flex justify-end">
                            {myOrder.course.status === "APPROVED" &&
                            myOrder.course.active === true ? (
                              <button
                                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 text-base font-semibold shadow"
                                onClick={() =>
                                  (window.location.href = `/student/learning/${myOrder.course.id}/${myOrder.course.chapters[0].lectures[0].id}`)
                                }
                              >
                                Continue Learning
                              </button>
                            ) : (
                              <button
                                className="bg-muted text-muted-foreground px-6 py-2 rounded-md text-base font-semibold shadow cursor-not-allowed"
                                disabled
                              >
                                Course is pending approval
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:bg-primary/10"
                    }`}
                  >
                    <FaChevronLeft className="h-5 w-5" />
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current page
                    const shouldShowPage =
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1;

                    if (shouldShowPage) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === pageNumber
                              ? "bg-primary text-white"
                              : "text-primary hover:bg-primary/10"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === 2 ||
                      pageNumber === totalPages - 1
                    ) {
                      return (
                        <span key={pageNumber} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:bg-primary/10"
                    }`}
                  >
                    <FaChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Page Info */}
              <div className="text-center text-sm text-muted-foreground mt-4">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * ITEMS_PER_PAGE + 1,
                  filteredOrders.length
                )}{" "}
                to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)}{" "}
                of {filteredOrders.length} courses
              </div>
            </>
          )}
        </div>

        {isReviewModalOpen && (
          <ReviewModal
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            setIsReviewModalOpen={setIsReviewModalOpen}
          />
        )}
      </div>
    </div>
  );
};

export default CoursePurchaseHistory;
