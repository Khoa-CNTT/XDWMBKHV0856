import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FiChevronRight, FiHome } from "react-icons/fi";

const BreadcrumbItem = ({ item, isLast, onClick }) => {
  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { scale: 1.05 },
  };

  return (
    <motion.div
      className="flex items-center"
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover={!isLast ? "hover" : undefined}
    >
      {!isLast ? (
        <>
          <button
            onClick={() => onClick(item.path)}
            className="text-accent hover:text-primary transition-colors duration-200 flex items-center"
            aria-label={`Navigate to ${item.label}`}
          >
            {item.label === "Home" ? (
              <FiHome className="w-4 h-4 mr-1" />
            ) : (
              item.label
            )}
          </button>
          <FiChevronRight className="mx-2 text-muted-foreground" />
        </>
      ) : (
        <span className="text-primary font-medium" aria-current="page">
          {item.label}
        </span>
      )}
    </motion.div>
  );
};

const AdvancedBreadcrumb = ({ path = [], onNavigate }) => {
  const defaultPath = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/courses" },
    { label: "Programming", path: "/courses/programming" },
    { label: "JavaScript Course", path: "/courses/programming/javascript" },
  ];

  const breadcrumbItems = useMemo(() => {
    return path.length > 0 ? path : defaultPath;
  }, [path]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-7xl mx-auto px-4 py-1">
      <motion.div
        className="flex flex-wrap items-center gap-y-2 text-body"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem
            key={item.path}
            item={item}
            isLast={index === breadcrumbItems.length - 1}
            onClick={handleClick}
          />
        ))}
      </motion.div>
    </nav>
  );
};

export default AdvancedBreadcrumb;
