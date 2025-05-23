import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleContactSupport = () => {
    navigate("/contact");
  };

  const faqs = [
    {
      question: "What is Jason Commerce?",
      answer: "Jason Commerce is an AI-powered e-commerce platform that provides personalized shopping experiences using cutting-edge technology to recommend products tailored to your preferences."
    },
    {
      question: "How does the AI recommendation work?",
      answer: "Our AI analyzes your browsing behavior, purchase history, and preferences to suggest products you'll love. It also considers current trends and customer reviews."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and cryptocurrency payments."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping is available for delivery within 1-2 business days. International shipping times vary by destination."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be unused and in their original packaging. Some exclusions apply for hygiene-related products."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can track your package using our order tracking page or directly with the carrier."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination. Duties and taxes may apply depending on your country's regulations."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our 24/7 customer support team via live chat on our website, email at support@jason-commerce.com, or phone at +1 (555) 123-4567."
    }
  ];

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold">❓ Frequently Asked Questions</h1>
          <p className="mt-2 text-gray-600">
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="overflow-hidden bg-white border border-gray-200 rounded-lg">
              <button
                className="flex items-center justify-between w-full px-4 py-3 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {activeIndex === index && (
                <div className="p-4 pt-0 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 mt-8 text-center rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold">Still have questions?</h2>
          <p className="mt-2 text-gray-600">
            Our customer support team is available 24/7 to assist you.
          </p>
          <button 
            onClick={handleContactSupport}
            className="px-4 py-2 mt-4 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}