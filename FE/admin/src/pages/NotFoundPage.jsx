import { motion } from "framer-motion";
import { FiHome, FiBook, FiAlertCircle } from "react-icons/fi";

const NotFoundPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          animate={{
            rotate: [0, -5, 5, -5, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          className="mb-8"
        >
          <FiAlertCircle className="text-primary w-24 h-24 mx-auto mb-4" />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-8xl font-bold text-primary mb-4"
        >
          404
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl text-accent mb-8">
          Oops! Looks like you've ventured into uncharted territory. This page
          seems to have gone on a learning break.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
            onClick={() => (window.location.href = "/")}
          >
            <FiHome className="w-5 h-5" />
            Back to Home
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold"
            onClick={() => (window.location.href = "/courses")}
          >
            <FiBook className="w-5 h-5" />
            Browse Courses
          </motion.button>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-8 text-sm text-accent">
          If you believe this is an error, please{" "}
          <button className="text-primary underline">report it</button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
