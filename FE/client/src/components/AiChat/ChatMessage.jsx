import { motion } from "framer-motion";
import { FaUser, FaRobot, FaDatabase, FaCloud, FaGoogle } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../../contexts/AuthContext";

const ChatMessage = ({ message, isUser, username, source, onCopy }) => {
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
        } max-w-[85%] group`}
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
            rounded-lg px-4 py-2 relative
            ${
              isUser
                ? "bg-primary text-white rounded-tr-none"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
            }
          `}
        >
          <div className="text-xs mb-1 font-medium flex items-center justify-between">
            <div className="flex items-center">
              {isUser ? username || "You" : "AI Assistant"}
              {getSourceIcon()}
            </div>
            <button
              onClick={() => onCopy(message)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded"
              title="Copy message"
            >
              <FiCopy size={14} />
            </button>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
