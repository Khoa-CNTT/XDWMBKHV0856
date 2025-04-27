import axios from "axios";

// Google Gemini API configuration
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Kiểm tra xem có lỗi CORS không
 * @param {Error} error - Lỗi cần kiểm tra
 * @returns {boolean} - True nếu là lỗi CORS
 */
const isCorsError = (error) => {
  return (
    error.message.includes("Network Error") ||
    error.message.includes("CORS") ||
    error.message.includes("Failed to fetch") ||
    error.message.includes("cross-origin")
  );
};

/**
 * Chuyển đổi lịch sử chat từ định dạng của ứng dụng sang định dạng của Gemini API
 * @param {Array} chatHistory - Lịch sử chat trong định dạng của ứng dụng
 * @returns {Array} - Lịch sử chat trong định dạng của Gemini API
 */
const formatChatHistoryForGemini = (chatHistory) => {
  return chatHistory.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
};

/**
 * Gửi tin nhắn đến Google Gemini API và nhận phản hồi
 * @param {string} message - Tin nhắn của người dùng
 * @param {Array} chatHistory - Các tin nhắn trước đó để cung cấp ngữ cảnh
 * @returns {Promise} - Phản hồi từ Gemini API
 */
export const sendChatMessage = async (message, chatHistory = []) => {
  try {
    if (!GEMINI_API_KEY) {
      console.error("Gemini API key is missing");
      throw new Error("API key is missing");
    }

    // Tạo một bản sao của lịch sử chat và thêm tin nhắn mới nhất
    const updatedHistory = [...chatHistory];
    if (
      !updatedHistory.some(
        (msg) => msg.role === "user" && msg.content === message
      )
    ) {
      updatedHistory.push({ role: "user", content: message });
    }

    // Định dạng lịch sử chat cho Gemini API
    const formattedHistory = formatChatHistoryForGemini(updatedHistory);

    // Thêm thông tin hệ thống vào phần đầu của lịch sử chat
    formattedHistory.unshift({
      role: "user",
      parts: [
        {
          text: `Bạn là trợ lý AI của VLearning, một nền tảng học trực tuyến. 
        Hãy cung cấp câu trả lời ngắn gọn, chính xác và thân thiện. 
        Ngoài việc trả lời về các khóa học và nền tảng VLearning,
        bạn có thể trả lời bất kỳ câu hỏi nào miễn là phù hợp và tôn trọng quy tắc đạo đức.
        Luôn trả lời bằng tiếng Việt trừ khi được yêu cầu sử dụng ngôn ngữ khác.`,
        },
      ],
    });

    // Chuẩn bị dữ liệu request cho Gemini API
    const requestData = {
      contents: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    console.log("Connecting to Google Gemini API...");

    // Gọi API Gemini
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // Tăng timeout lên 30 giây
      }
    );

    // Xử lý kết quả từ Gemini
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates.length > 0
    ) {
      const geminiResponse = response.data.candidates[0].content.parts[0].text;
      return { message: geminiResponse, source: "gemini" };
    } else {
      console.error("Unexpected API response structure:", response.data);
      throw new Error("Invalid API response");
    }
  } catch (error) {
    console.error("Error connecting to Gemini:", error);

    // Trả về thông báo lỗi
    let errorMessage =
      "Xin lỗi, tôi không thể kết nối với dịch vụ AI lúc này. Vui lòng thử lại sau.";
    let errorDetails = "";

    // Xử lý các loại lỗi cụ thể
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("API Error Status:", error.response.status);

      if (error.response.status === 400) {
        errorMessage =
          "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại nội dung tin nhắn của bạn.";
        errorDetails = "Invalid request";
      } else if (error.response.status === 401) {
        errorMessage =
          "Xin lỗi, không thể xác thực với dịch vụ AI. API key không hợp lệ hoặc đã hết hạn.";
        errorDetails = "Unauthorized: API key error";
      } else if (error.response.status === 429) {
        errorMessage =
          "Xin lỗi, đã vượt quá giới hạn gọi API của dịch vụ. Vui lòng thử lại sau.";
        errorDetails = "Rate limited";
      } else if (error.response.status >= 500) {
        errorMessage =
          "Xin lỗi, dịch vụ AI đang gặp sự cố. Vui lòng thử lại sau.";
        errorDetails = "Server error";
      }
    } else if (isCorsError(error)) {
      errorMessage =
        "Không thể kết nối với dịch vụ AI do vấn đề bảo mật CORS. Vui lòng sử dụng proxy server hoặc liên hệ quản trị viên.";
      errorDetails = "CORS issue";
    } else if (error.code === "ECONNABORTED") {
      errorMessage =
        "Kết nối với dịch vụ AI đã hết thời gian chờ. Vui lòng thử lại sau.";
      errorDetails = "Timeout";
    }

    return {
      message: errorMessage,
      source: "error",
      errorDetails: errorDetails,
    };
  }
};

/**
 * Fallback khi gặp sự cố
 * @param {string} message - Tin nhắn của người dùng
 * @returns {Promise} - Phản hồi đơn giản
 */
export const getBasicResponse = async (message) => {
  const messageL = message.toLowerCase();

  // Một số câu trả lời cơ bản
  if (
    messageL.includes("xin chào") ||
    messageL.includes("chào") ||
    messageL.includes("hello") ||
    messageL.includes("hi")
  ) {
    return {
      message:
        "Xin chào! Tôi là trợ lý AI của VLearning. Tôi có thể giúp gì cho bạn?",
      source: "basic",
    };
  }

  if (
    messageL.includes("khóa học") ||
    messageL.includes("học") ||
    messageL.includes("khoá học") ||
    messageL.includes("course")
  ) {
    return {
      message:
        "VLearning cung cấp nhiều khóa học từ lập trình, thiết kế đến marketing và kinh doanh. Bạn quan tâm đến lĩnh vực nào?",
      source: "basic",
    };
  }

  if (
    messageL.includes("giá") ||
    messageL.includes("phí") ||
    messageL.includes("thanh toán") ||
    messageL.includes("payment")
  ) {
    return {
      message:
        "Các khóa học của chúng tôi có nhiều mức giá khác nhau tùy thuộc vào nội dung. Chúng tôi hỗ trợ nhiều hình thức thanh toán như thẻ tín dụng, chuyển khoản ngân hàng và các ví điện tử phổ biến.",
      source: "basic",
    };
  }

  // Câu trả lời mặc định
  return {
    message:
      "Xin lỗi, tôi không thể trả lời câu hỏi của bạn lúc này. Vui lòng thử lại sau.",
    source: "basic",
  };
};
