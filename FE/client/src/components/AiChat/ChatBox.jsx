import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import {
  sendChatMessage,
  getBasicResponse,
} from "../../services/ai-chat.services";
import ChatMessage from "./ChatMessage";
import ChatTypingIndicator from "./ChatTypingIndicator";
import { useAuth } from "../../contexts/AuthContext";

const ChatBox = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý AI của VLearning. Bạn có thể hỏi tôi bất kỳ câu hỏi nào và tôi sẽ cố gắng trả lời một cách chính xác nhất!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages whenever chat history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
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
      // Gửi tin nhắn đến OpenAI
      const response = await sendChatMessage(message, chatHistory);

      setIsTyping(false);

      // Add AI response to chat
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

      // Nếu có lỗi, sử dụng phản hồi cơ bản
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
        className="fixed right-6 bottom-6 bg-primary text-white p-4 rounded-full shadow-lg z-40"
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
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: "500px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-6 w-80 md:w-96 bg-white rounded-lg shadow-2xl overflow-hidden z-40 border border-gray-200"
          >
            <div className="flex flex-col h-full justify-between">
              {/* Chat header */}
              <div className="bg-primary text-white p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FaRobot className="mr-2" />
                  <h3 className="font-medium">VLearning AI Chat</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleChat}
                    className="hover:bg-primary-dark p-1 rounded transition"
                    aria-label="Đóng chat"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>

              {/* Chat content - only shown when not minimized */}
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col h-[400px]"
                >
                  {/* Chat messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {chatHistory.map((msg, index) => (
                      <ChatMessage
                        key={index}
                        message={msg.content}
                        isUser={msg.role === "user"}
                        username={
                          msg.role === "user" ? user?.fullName : "AI Assistant"
                        }
                        source={msg.source}
                      />
                    ))}
                    {isTyping && <ChatTypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat input */}
                  <form
                    onSubmit={handleSubmit}
                    className="p-3 border-t border-gray-200"
                  >
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hỏi bất kỳ câu hỏi nào..."
                        className="flex-1 p-2 focus:outline-none text-gray-700"
                      />
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className="bg-primary text-white p-2 disabled:opacity-50"
                        aria-label="Send message"
                      >
                        <FiSend />
                      </button>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBox;
