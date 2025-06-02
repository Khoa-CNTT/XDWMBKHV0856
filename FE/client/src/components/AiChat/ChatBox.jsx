import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiMinimize2,
  FiMaximize2,
  FiCopy,
  FiTrash2,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";
import {
  sendChatMessage,
  getBasicResponse,
} from "../../services/ai-chat.services";
import ChatMessage from "./ChatMessage";
import ChatTypingIndicator from "./ChatTypingIndicator";
import { useAuth } from "../../contexts/AuthContext";

const STORAGE_KEY = "vlearning_chat_history";

const ChatBox = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            content:
              "Xin chào! Tôi là trợ lý AI của VLearning. Bạn có thể hỏi tôi bất kỳ câu hỏi nào và tôi sẽ cố gắng trả lời một cách chính xác nhất!",
          },
        ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 384, height: 500 });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chatWindowRef.current) {
        const rect = chatWindowRef.current.getBoundingClientRect();
        setWindowSize({ width: rect.width, height: rect.height });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const clearChat = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ lịch sử chat?")) {
      setChatHistory([
        {
          role: "assistant",
          content:
            "Xin chào! Tôi là trợ lý AI của VLearning. Bạn có thể hỏi tôi bất kỳ câu hỏi nào và tôi sẽ cố gắng trả lời một cách chính xác nhất!",
        },
      ]);
      toast.success("Đã xóa lịch sử chat");
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Đã sao chép vào clipboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: message };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await sendChatMessage(message, chatHistory);
      setIsTyping(false);

      setChatHistory((current) => [
        ...current,
        {
          role: "assistant",
          content: response.message,
          source: response.source || "unknown",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);

      const basicResponse = await getBasicResponse(message);
      setChatHistory((current) => [
        ...current,
        {
          role: "assistant",
          content: basicResponse.message,
          source: basicResponse.source || "error",
        },
      ]);
    }
  };

  return (
    <>
      {/* Chat button */}
      <motion.button
        onClick={toggleChat}
        className="fixed right-6 bottom-6 bg-primary text-white p-4 rounded-full shadow-lg z-40 hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Chat with AI assistant"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "60px" : `${windowSize.height}px`,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-6 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden z-40 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col h-full">
              {/* Chat header */}
              <div className="bg-primary text-white p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FaRobot className="mr-2" />
                  <h3 className="font-medium">VLearning AI Chat</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearChat}
                    className="hover:bg-primary-dark p-1 rounded transition"
                    aria-label="Clear chat"
                    title="Xóa lịch sử chat"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <button
                    onClick={toggleMinimize}
                    className="hover:bg-primary-dark p-1 rounded transition"
                    aria-label={isMinimized ? "Maximize" : "Minimize"}
                    title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
                  >
                    {isMinimized ? (
                      <FiMaximize2 size={16} />
                    ) : (
                      <FiMinimize2 size={16} />
                    )}
                  </button>
                  <button
                    onClick={toggleChat}
                    className="hover:bg-primary-dark p-1 rounded transition"
                    aria-label="Close chat"
                    title="Đóng chat"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>

              {/* Chat content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Chat messages */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-[380px]">
                      {chatHistory.map((msg, index) => (
                        <ChatMessage
                          key={index}
                          message={msg.content}
                          isUser={msg.role === "user"}
                          username={
                            msg.role === "user"
                              ? user?.fullName
                              : "AI Assistant"
                          }
                          source={msg.source}
                          onCopy={() => copyMessage(msg.content)}
                        />
                      ))}
                      {isTyping && <ChatTypingIndicator />}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat input */}
                    <form
                      onSubmit={handleSubmit}
                      className="p-3 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                        <input
                          ref={inputRef}
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Hỏi bất kỳ câu hỏi nào..."
                          className="flex-1 p-2 focus:outline-none text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
                        />
                        <button
                          type="submit"
                          disabled={!message.trim()}
                          className="bg-primary text-white p-2 disabled:opacity-50 hover:bg-primary/90 transition-colors"
                          aria-label="Send message"
                        >
                          <FiSend />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBox;
