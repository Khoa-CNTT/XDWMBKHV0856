import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import { Avatar, AvatarFallback } from "../ui/avatar";

const ChatTypingIndicator = () => {
  return (
    <div className="mb-4 flex justify-start">
      <div className="flex flex-row max-w-[85%]">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-2">
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">
              <FaRobot />
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Typing indicator */}
        <div className="rounded-lg px-4 py-3 bg-gray-100 text-gray-800 rounded-tl-none flex items-end">
          <div className="flex space-x-1">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
              className="w-2 h-2 bg-gray-400 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              className="w-2 h-2 bg-gray-400 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              className="w-2 h-2 bg-gray-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTypingIndicator;
