import { motion } from "framer-motion";
import { FaUser, FaRobot, FaDatabase, FaCloud, FaGoogle } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../../contexts/AuthContext";

const ChatMessage = ({ message, isUser, username, source }) => {
  const { user } = useAuth();

  const getSourceIcon = () => {
    if (isUser) return null;

    switch (source) {
      case "gemini":
        return (
          <FaGoogle
            size={10}
            className="ml-1 text-blue-500"
            title="Powered by Google Gemini"
          />
        );
      case "training":
        return (
          <FaDatabase
            size={10}
            className="ml-1 text-blue-400"
            title="Từ dữ liệu training"
          />
        );
      case "openai":
        return (
          <FaCloud
            size={10}
            className="ml-1 text-green-400"
            title="Từ OpenAI"
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex ${
          isUser ? "flex-row-reverse" : "flex-row"
        } max-w-[85%]`}
      >
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-2" : "mr-2"}`}>
          {isUser ? (
            <Avatar>
              <AvatarImage
                src={
                  user?.avatar
                    ? `${import.meta.env.VITE_AVATAR_URL}/${user?.id}/${
                        user?.avatar
                      }`
                    : undefined
                }
              />
              <AvatarFallback className="bg-primary text-white">
                {username?.charAt(0) || <FaUser />}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                <FaRobot />
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Message content */}
        <div
          className={`
            rounded-lg px-4 py-2 
            ${
              isUser
                ? "bg-primary text-white rounded-tr-none"
                : "bg-gray-100 text-gray-800 rounded-tl-none"
            }
          `}
        >
          <div className="text-xs mb-1 font-medium flex items-center">
            {isUser ? username || "You" : "AI Assistant"}
            {getSourceIcon()}
          </div>
          <div className="whitespace-pre-wrap">{message}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
