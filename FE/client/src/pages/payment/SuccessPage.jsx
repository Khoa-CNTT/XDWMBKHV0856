import { motion } from "framer-motion";
import { FaCheckCircle, FaBookOpen } from "react-icons/fa";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { useSearchParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const { data, loading } = useFetch(
    `/orders?filter=orderCode~'${encodeURIComponent(orderCode)}'`
  );
  const orders = data?.result || []; // Get all orders with the same orderCode
  const { width, height } = useWindowSize();

  console.log(orders);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't find the order you're looking for.
          </p>
          <button
            onClick={() => (window.location.href = "/courses")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Return to Courses
          </button>
        </div>
      </div>
    );
  }

  // Calculate total amount for multiple courses
  const totalAmount = orders.reduce((sum, order) => {
    // Fetch course details for each order
    const coursePrice = order.course?.price || 0;
    return sum + coursePrice;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        recycle={false}
        colors={["#4CAF50", "#03A9F4", "#FFC107", "#FF6F61", "#8E44AD"]}
      />

      <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg p-8 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <FaCheckCircle className="text-chart-2 text-6xl sm:text-7xl mb-6" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-heading text-foreground mb-4"
        >
          Payment Successful!
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-8"
        >
          {orders.length === 1 ? (
            // Single course purchase
            <div className="bg-muted p-4 rounded-md">
              <p className="text-body text-accent mb-2">Course</p>
              <p className="font-semibold text-foreground">
                {orders[0].course?.title || "Course Title"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {orders[0].course?.shortIntroduce || "No description available"}
              </p>
            </div>
          ) : (
            // Multiple courses purchase
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <FaBookOpen className="text-primary" />
                <p className="text-body text-accent">Purchased Courses</p>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-card p-3 rounded-md text-left"
                  >
                    <p className="font-semibold text-foreground">
                      {order.course?.title || "Course Title"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.course?.shortIntroduce ||
                        "No description available"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between px-4">
            <div>
              <p className="text-body text-accent mb-1">Total Amount</p>
              <p className="font-semibold text-foreground">
                {totalAmount.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
            <div>
              <p className="text-body text-accent mb-1">Date</p>
              <p className="font-semibold text-foreground">
                {orders[0].createdAt.split(" ")[0]}
              </p>
            </div>
          </div>

          <div className="text-sm text-accent">
            Order Code: {orders[0].orderCode}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold transition-colors hover:bg-primary/90"
            onClick={() => (window.location.href = "/courses")}
          >
            Return to Courses
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
