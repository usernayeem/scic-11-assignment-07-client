import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiHelpCircle } from "react-icons/fi";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I get started with EduManage?",
      answer:
        "Simply create a free account, browse our courses, and enroll in the ones you like. You can start learning immediately!",
    },
    {
      question: "Are courses self-paced?",
      answer:
        "Yes! All courses are self-paced, so you can learn at your own speed and schedule.",
    },
    {
      question: "Do I get a certificate when I complete a course?",
      answer:
        "Yes, you'll receive a verified certificate of completion for every course you finish.",
    },
    {
      question: "How long do I have access to courses?",
      answer:
        "Once you enroll, you have lifetime access to your courses. Learn at your own pace!",
    },
    {
      question: "What if I'm not satisfied with a course?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not happy, we'll refund your purchase.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Absolutely! Our platform works on all devices - desktop, tablet, and mobile.",
    },
    {
      question: "Do you offer student discounts?",
      answer:
        "Yes, we regularly offer promotions and discounts. Sign up for our newsletter to stay updated.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach our support team 24/7 through live chat, email, or our help center.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] bg-opacity-10 rounded-full mx-auto mb-4">
            <FiHelpCircle className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about EduManage
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <FiChevronUp className="w-5 h-5 text-[#5D5CDE] flex-shrink-0" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
