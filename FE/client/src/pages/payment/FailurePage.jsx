import { motion } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";

const FailurePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <FaTimesCircle className="text-red-500 text-6xl sm:text-7xl mb-6" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-heading text-foreground mb-4"
        >
          Payment Failed
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-8"
        >
          <p className="text-accent">
            We couldn't process your payment. Please try again or contact
            support if the problem persists.
          </p>
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
            onClick={() => window.history.back()}
          >
            Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-secondary text-secondary-foreground py-3 rounded-md font-semibold transition-colors hover:bg-secondary/90"
            onClick={() => (window.location.href = "/courses")}
          >
            Return to Courses
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FailurePage;
