import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import { FiSettings, FiGlobe, FiHelpCircle, FiLogOut } from "react-icons/fi";
import useClickOutside from "../../../hooks/useClickOutside";

const User = () => {
  const { user, handleLogout } = useAuth();
  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);

  const dropdownRef = useClickOutside(() => {
    if (isOpenUserDropdown) {
      setIsOpenUserDropdown(false);
    }
  });

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const menuItems = [
    { icon: <FiSettings className="w-5 h-5" />, label: "Account Settings" },
    { icon: <FiGlobe className="w-5 h-5" />, label: "Language" },
    { icon: <FiHelpCircle className="w-5 h-5" />, label: "Help & Support" },
    { icon: <FiLogOut className="w-5 h-5" />, label: "Logout" },
  ];

  if (!user)
    return (
      <button
        onClick={() => {
          window.location.href = "/login";
        }}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
      >
        Sign In
      </button>
    );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpenUserDropdown(!isOpenUserDropdown)}
        aria-label="User menu"
        aria-expanded={isOpenUserDropdown}
        aria-haspopup="true"
        className="flex items-center space-x-2"
      >
        <img
          src={`${import.meta.env.VITE_AVATAR_URL}/${user.id}/${user.avatar}`}
          alt="User Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      </button>
      <AnimatePresence>
        {isOpenUserDropdown && (
          <>
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              role="button"
              onClick={() => setIsOpenUserDropdown(false)}
            />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 rounded-lg bg-card shadow-lg border border-border z-50"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <img
                    src={`${import.meta.env.VITE_AVATAR_URL}/${user.id}/${
                      user.avatar
                    }`}
                    alt="User profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-heading text-foreground">
                      {user.fullName}
                    </h3>
                    <p className="text-sm text-accent">{user.email}</p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (item.label === "Logout") handleLogout();
                      if (item.label === "Account Settings")
                        window.location.href = "/student/account";
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-muted text-foreground transition-colors`}
                    role="menuitem"
                  >
                    <span className="mr-3 text-accent">{item.icon}</span>
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default User;
