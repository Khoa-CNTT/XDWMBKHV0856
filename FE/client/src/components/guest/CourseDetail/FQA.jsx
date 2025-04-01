import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

const FQA = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How long do I have access to the course?",
      answer: "Lifetime access",
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "30-day money-back guarantee",
    },
    { question: "Do I get a certificate?", answer: "Yes, upon completion" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 dark:border-gray-700"
            >
              {/* Nút mở/đóng nội dung câu trả lời */}
              <button
                className="flex justify-between items-center w-full"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <span className="font-semibold dark:text-white">
                  {faq.question}
                </span>
                <FaChevronRight
                  className={`transform transition-transform ${
                    activeFaq === index ? "rotate-90" : ""
                  }`}
                />
              </button>
              {/* Nội dung câu trả lời, chỉ hiển thị khi được mở */}
              {activeFaq === index && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FQA;
