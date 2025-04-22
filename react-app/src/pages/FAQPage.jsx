import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is MyTSV.com?",
    answer:
      "MyTSV is a video-sharing platform designed for local businesses, professionals, and specialists to showcase their services, talents, and products through video content.",
  },
  {
    question: "Who can join MyTSV?",
    answer:
      "Anyone! Whether you’re a business owner, freelancer, artist, or service provider in your local area, MyTSV is for you.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Click on the Sign Up button at the top right corner of the homepage and follow the registration process.",
  },
  {
    question: "Is there a fee to use MyTSV?",
    answer:
      "Browsing and watching videos is free. We also offer free and premium plans for content creators and businesses.",
  },
  {
    question: "How do I upload a video?",
    answer:
      "After logging in, click the Upload Video button on your dashboard and follow the steps.",
  },
  {
    question: "Can I like, share, and comment on videos?",
    answer:
      "Yes! Users can like, comment, and share videos as well as save them to favorites.",
  },
  {
    question: "Are videos moderated?",
    answer:
      "Yes, videos are reviewed for compliance with community guidelines and inappropriate content is removed.",
  },
  {
    question: "How can I find local businesses or professionals?",
    answer:
      "Use our search bar or browse by category or location.",
  },
  {
    question: "How are ratings and reviews managed?",
    answer:
      "Users can rate videos and leave feedback. Spam and abuse are monitored.",
  },
  {
    question: "I forgot my password. What should I do?",
    answer:
      "Click the Forgot Password? link on the login page and follow the instructions.",
  },
  {
    question: "Can I advertise my business on MyTSV?",
    answer:
      "Yes, we offer promoted videos, homepage features, and banner placements. Contact ads@mytsv.com for details.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Email support@mytsv.com or use the Contact Us form on our website.",
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions (FAQ)</h1>
      <p className="text-center mb-8 text-gray-600">
        Welcome to the MyTSV Help Center! Here are answers to the most common questions about how our platform works and how you can get the most out of it.
      </p>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-300"
          >
            <button
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-medium text-lg flex items-center justify-between focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {activeIndex === index ? <Minus className="w-5 h-5 text-gray-600" /> : <Plus className="w-5 h-5 text-gray-600" />}
            </button>
            <div
              className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                activeIndex === index ? 'max-h-40 py-3 bg-white text-gray-700 border-t border-gray-200' : 'max-h-0'
              }`}
            >
              {activeIndex === index && <p>{faq.answer}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
