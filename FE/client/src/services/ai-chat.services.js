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
 * Lấy thông tin khóa học từ API
 * @returns {Promise<Array>} - Danh sách khóa học
 */
const fetchCoursesData = async () => {
  try {
    console.log("Fetching courses from API...");
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/courses`);

    // Log chi tiết response để debug
    console.log("Courses API Response:", {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    });

    // Kiểm tra response status
    if (response.status !== 200) {
      console.error("Courses API returned non-200 status:", response.status);
      return [];
    }

    // Kiểm tra cấu trúc response
    if (!response.data) {
      console.error("Empty response from courses API");
      return [];
    }

    // Kiểm tra response có lỗi không
    if (response.data.error) {
      console.error("Courses API returned error:", response.data.error);
      return [];
    }

    // Lấy data từ response, xử lý các cấu trúc khác nhau
    let coursesData;
    const responseData = response.data.data || response.data;

    // Log cấu trúc dữ liệu để debug
    console.log("Response data structure:", {
      hasData: !!responseData,
      isArray: Array.isArray(responseData),
      type: typeof responseData,
      keys: Object.keys(responseData),
    });

    if (responseData.result && Array.isArray(responseData.result)) {
      coursesData = responseData.result;
      console.log("Found courses in result array:", coursesData.length);
    } else if (responseData.data && Array.isArray(responseData.data)) {
      coursesData = responseData.data;
      console.log("Found courses in data array:", coursesData.length);
    } else if (Array.isArray(responseData)) {
      coursesData = responseData;
      console.log("Found courses in root array:", coursesData.length);
    } else if (typeof responseData === "object") {
      // Thử chuyển đổi object thành array nếu có thể
      const values = Object.values(responseData);
      if (values.length > 0 && values.every((v) => typeof v === "object")) {
        coursesData = values;
        console.log(
          "Converted object to array of courses:",
          coursesData.length
        );
      } else {
        console.error("Unexpected data structure in response:", responseData);
        return [];
      }
    } else {
      console.error("Unexpected courses data type:", typeof responseData);
      return [];
    }

    // Validate và chuyển đổi dữ liệu
    const validCourses = coursesData
      .filter((course) => {
        // Kiểm tra điều kiện cơ bản
        if (!course || typeof course !== "object") {
          console.warn("Invalid course object:", course);
          return false;
        }

        // Log chi tiết về course để debug
        console.log("Processing course:", {
          title: course.title,
          price: course.price,
          status: course.status,
          active: course.active,
        });

        // Kiểm tra các trường bắt buộc
        const hasRequiredFields =
          course.title &&
          typeof course.price === "number" &&
          course.status === "APPROVED" && // Chỉ lấy khóa học đã được duyệt
          course.active === true; // Chỉ lấy khóa học đang active

        if (!hasRequiredFields) {
          console.warn(
            "Course missing required fields or not approved/active:",
            {
              title: course.title,
              price: course.price,
              status: course.status,
              active: course.active,
            }
          );
          return false;
        }

        return true;
      })
      .map((course) => ({
        ...course,
        // Đảm bảo các trường số có giá trị mặc định hợp lý
        price: course.price || 0,
        students: course.students || 0,
        rating: course.rating || 0,
        // Đảm bảo các trường chuỗi có giá trị mặc định
        title: course.title,
        description: course.description || "Chưa có mô tả",
        status: course.status,
        active: course.active,
        // Xử lý sections và lessons
        sections: Array.isArray(course.sections)
          ? course.sections
              .filter((section) => section && typeof section === "object")
              .map((section) => ({
                ...section,
                title: section.title || "Chưa có tiêu đề",
                lessons: Array.isArray(section.lessons)
                  ? section.lessons
                      .filter((lesson) => lesson && typeof lesson === "object")
                      .map((lesson) => ({
                        ...lesson,
                        title: lesson.title || "Chưa có tiêu đề",
                        description: lesson.description || "Chưa có mô tả",
                      }))
                  : [],
              }))
          : [],
      }));

    console.log("Processed courses data:", {
      total: coursesData.length,
      valid: validCourses.length,
      courses: validCourses.map((c) => ({
        title: c.title,
        price: c.price,
        status: c.status,
        active: c.active,
      })),
    });

    if (validCourses.length === 0) {
      console.warn("No approved and active courses found");
    }

    return validCourses;
  } catch (error) {
    console.error("Error fetching courses:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return [];
  }
};

/**
 * Tạo system prompt với thông tin khóa học
 * @param {Array} courses - Danh sách khóa học
 * @returns {string} - System prompt
 */
const createSystemPrompt = (courses) => {
  const fallbackPrompt = `Bạn là trợ lý AI của VLearning, một nền tảng học trực tuyến. Nếu không có thông tin về khóa học, hãy trả lời 'Hiện tại tôi không có dữ liệu về các khóa học.'`;

  if (!Array.isArray(courses) || courses.length === 0) {
    return fallbackPrompt;
  }

  // Lấy lựa chọn của người dùng từ localStorage
  let selectedFieldIds = [];
  let selectedSkillIds = [];
  try {
    selectedFieldIds =
      JSON.parse(localStorage.getItem("selectedFieldIds")) || [];
    selectedSkillIds = JSON.parse(localStorage.getItem("subjects")) || [];
  } catch {
    // Ignore JSON parse errors and use empty arrays
  }

  // Ưu tiên các khóa học có field hoặc skill trùng với lựa chọn của user
  let prioritizedCourses = courses.filter((course) => {
    // Kiểm tra field
    const hasField =
      Array.isArray(course.fields) &&
      course.fields.some((f) => selectedFieldIds.includes(f.id));
    // Kiểm tra skill
    const hasSkill =
      Array.isArray(course.skills) &&
      course.skills.some((s) => selectedSkillIds.includes(s.id));
    return hasField || hasSkill;
  });

  // Nếu không có khóa học ưu tiên, fallback sang các khóa học nổi bật
  if (prioritizedCourses.length === 0) {
    prioritizedCourses = courses;
  }

  // Lấy tối đa 5 khóa học ưu tiên
  const topCourses = prioritizedCourses.slice(0, 5);

  const coursesInfo = topCourses
    .map((course) => {
      const price = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(course.price);
      return `- ${course.title}: ${
        course.description?.slice(0, 60) || ""
      } (Giá: ${price}, Đánh giá: ${course.rating}/5)`;
    })
    .join("\n");

  return `Bạn là trợ lý AI của VLearning. Dưới đây là một số khóa học phù hợp với lĩnh vực/kỹ năng bạn quan tâm:\n${coursesInfo}\nNếu người dùng hỏi về các khóa học, hãy trả lời dựa trên danh sách trên. Nếu không có thông tin, hãy trả lời 'Hiện tại tôi không có dữ liệu về các khóa học.'`;
};

/**
 * Xử lý response từ Gemini API
 * @param {Object} response - Response từ Gemini API
 * @returns {Object} - Kết quả đã xử lý
 */
const handleGeminiResponse = (response) => {
  // Kiểm tra response rỗng
  if (!response?.data) {
    console.error("Empty response from Gemini API");
    return {
      message:
        "Xin lỗi, không nhận được phản hồi từ hệ thống. Vui lòng thử lại sau.",
      source: "error",
      errorDetails: "Empty API response",
    };
  }

  // Log toàn bộ response để debug
  console.log("Raw Gemini response:", response.data);

  // Kiểm tra cấu trúc response với candidates
  if (response.data.candidates?.[0]?.content) {
    const candidate = response.data.candidates[0];
    const content = candidate.content;

    // Log chi tiết về candidate để debug
    console.log("Processing Gemini candidate:", {
      role: content.role,
      hasParts: !!content.parts,
      partsLength: content.parts?.length,
      firstPartText: content.parts?.[0]?.text,
      finishReason: candidate.finishReason,
    });

    // Kiểm tra nếu model không trả lời
    if (
      content.role === "model" &&
      (!content.parts || content.parts.length === 0 || !content.parts[0].text)
    ) {
      console.warn("Model returned empty response");
      return {
        message:
          "Xin lỗi, tôi không thể tạo câu trả lời phù hợp. Vui lòng thử lại với câu hỏi khác.",
        source: "error",
        errorDetails: "Empty model response",
      };
    }

    // Kiểm tra finishReason
    if (candidate.finishReason === "SAFETY") {
      console.warn("Response blocked by safety settings");
      return {
        message:
          "Xin lỗi, tôi không thể trả lời câu hỏi này do vi phạm chính sách nội dung.",
        source: "error",
        errorDetails: "Safety policy violation",
      };
    }

    // Kiểm tra và lấy text từ parts
    if (content.parts?.[0]?.text) {
      const text = content.parts[0].text.trim();
      if (text) {
        return {
          message: text,
          source: "gemini",
        };
      }
    }

    // Nếu không có text hợp lệ
    console.warn("No valid text in response parts");
    return {
      message:
        "Xin lỗi, tôi không thể tạo câu trả lời phù hợp. Vui lòng thử lại với câu hỏi khác.",
      source: "error",
      errorDetails: "No valid text in response",
    };
  }

  // Kiểm tra cấu trúc response với content trực tiếp
  if (response.data.content) {
    const content = response.data.content;

    // Kiểm tra safety ratings
    const safetyRatings = response.data.safetyRatings || [];
    const hasSafetyIssues = safetyRatings.some(
      (rating) =>
        rating.probability !== "NEGLIGIBLE" && rating.probability !== "LOW"
    );

    if (hasSafetyIssues) {
      console.warn("Safety issues detected:", safetyRatings);
      return {
        message:
          "Xin lỗi, tôi không thể trả lời câu hỏi này do vi phạm chính sách nội dung.",
        source: "error",
        errorDetails: "Safety policy violation",
      };
    }

    // Xử lý các loại content khác nhau
    if (content.parts?.[0]?.text) {
      const text = content.parts[0].text.trim();
      if (text) {
        return {
          message: text,
          source: "gemini",
        };
      }
    } else if (content.text) {
      const text = content.text.trim();
      if (text) {
        return {
          message: text,
          source: "gemini",
        };
      }
    }

    // Nếu không có text hợp lệ
    console.warn("No valid text in content");
    return {
      message:
        "Xin lỗi, tôi không thể tạo câu trả lời phù hợp. Vui lòng thử lại với câu hỏi khác.",
      source: "error",
      errorDetails: "No valid text in content",
    };
  }

  // Nếu không match với bất kỳ cấu trúc nào
  console.error("Unexpected response structure:", response.data);
  return {
    message:
      "Xin lỗi, phản hồi từ hệ thống không đúng định dạng. Vui lòng thử lại sau.",
    source: "error",
    errorDetails: "Invalid response structure",
  };
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
      return {
        message:
          "Xin lỗi, có lỗi cấu hình hệ thống. Vui lòng liên hệ quản trị viên.",
        source: "error",
        errorDetails: "Missing API key",
      };
    }

    // Lấy thông tin khóa học
    const courses = await fetchCoursesData();
    const systemPrompt = createSystemPrompt(courses);

    // Validate và chuẩn bị chat history
    const validHistory = Array.isArray(chatHistory) ? chatHistory : [];
    const updatedHistory = [...validHistory];

    // Thêm tin nhắn mới nếu chưa có
    if (
      !updatedHistory.some(
        (msg) => msg.role === "user" && msg.content === message
      )
    ) {
      updatedHistory.push({ role: "user", content: message });
    }

    // Định dạng lịch sử chat cho Gemini API
    const formattedHistory = formatChatHistoryForGemini(updatedHistory);

    // Thêm system prompt
    formattedHistory.unshift({
      role: "user",
      parts: [{ text: systemPrompt }],
    });

    // Chuẩn bị request data
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

    console.log("Sending request to Gemini API...");

    // Gọi API Gemini
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    // Xử lý response bằng hàm mới
    return handleGeminiResponse(response);
  } catch (error) {
    console.error("Error in sendChatMessage:", error);

    // Xử lý các loại lỗi cụ thể
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("API Error Status:", error.response.status);

      if (error.response.status === 400) {
        return {
          message:
            "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại nội dung tin nhắn của bạn.",
          source: "error",
          errorDetails: "Invalid request",
        };
      } else if (error.response.status === 401) {
        return {
          message:
            "Xin lỗi, không thể xác thực với dịch vụ AI. Vui lòng liên hệ quản trị viên.",
          source: "error",
          errorDetails: "Unauthorized",
        };
      } else if (error.response.status === 429) {
        return {
          message:
            "Xin lỗi, đã vượt quá giới hạn gọi API. Vui lòng thử lại sau.",
          source: "error",
          errorDetails: "Rate limited",
        };
      }
    }

    // Lỗi mạng hoặc timeout
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return {
        message:
          "Kết nối với dịch vụ AI đã hết thời gian chờ. Vui lòng thử lại sau.",
        source: "error",
        errorDetails: "Timeout",
      };
    }

    // Lỗi CORS
    if (isCorsError(error)) {
      return {
        message:
          "Không thể kết nối với dịch vụ AI do vấn đề bảo mật. Vui lòng liên hệ quản trị viên.",
        source: "error",
        errorDetails: "CORS issue",
      };
    }

    // Lỗi khác
    return {
      message:
        "Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.",
      source: "error",
      errorDetails: error.message || "Unknown error",
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
