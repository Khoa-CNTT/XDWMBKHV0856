import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { format } from "date-fns";
import { useAuthStore } from "../../store/useAuthStore";
import { getOrder } from "../../services/order.services";

const SuccessPage = () => {
  const { width, height } = useWindowSize();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrder(user.id);
      setOrders(data);
    };

    fetchOrders();
  }, []);

  console.log(orders);

  const transactionData = {
    courseName: "Advanced React Development",
    amount: 299.99,
    transactionId: "TXN_123456789",
    date: new Date(),
  };

  useEffect(() => {
    document.title = "Payment Successful | Thank You";
  }, []);

  const downloadReceipt = () => {
    console.log("Downloading receipt...");
  };

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
              {transactionData.courseName}
            </p>
          </div>

          <div className="flex justify-between px-4">
            <div>
              <p className="text-body text-accent mb-1">Amount Paid</p>
              <p className="font-semibold text-foreground">
                ${transactionData.amount}
              </p>
            </div>
            <div>
              <p className="text-body text-accent mb-1">Date</p>
              <p className="font-semibold text-foreground">
                {format(transactionData.date, "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="text-sm text-accent">
            Transaction ID: {transactionData.transactionId}
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
