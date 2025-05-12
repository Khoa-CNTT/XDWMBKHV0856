import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
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
  const order = data?.result?.[0]; // Get first order from result array
  const { width, height } = useWindowSize();

  const downloadReceipt = () => {
    console.log("Downloading receipt...");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        recycle={false}
        colors={["#4CAF50", "#03A9F4", "#FFC107", "#FF6F61", "#8E44AD"]}
      />

      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
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
          <div className="bg-muted p-4 rounded-md">
            <p className="text-body text-accent mb-2">Course</p>
            <p className="font-semibold text-foreground">
              {order.course?.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {order.course?.shortIntroduce}
            </p>
          </div>

          <div className="flex justify-between px-4">
            <div>
              <p className="text-body text-accent mb-1">Amount Paid</p>
              <p className="font-semibold text-foreground">
                {order.course.price?.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
            <div>
              <p className="text-body text-accent mb-1">Date</p>
              <p className="font-semibold text-foreground">
                {order.createdAt.split(" ")[0]}
              </p>
            </div>
          </div>

          <div className="text-sm text-accent">
            Order Code: {order.orderCode}
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-secondary text-secondary-foreground py-3 rounded-md font-semibold transition-colors hover:bg-secondary/90"
            onClick={downloadReceipt}
          >
            Download Receipt
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
