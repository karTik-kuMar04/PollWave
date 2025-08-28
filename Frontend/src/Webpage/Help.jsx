import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I join a poll or quiz?",
      answer:
        "You can join using the code or link shared by the host. Enter the code on the homepage or click the shared link to get started."
    },
    {
      question: "How do I vote in a poll?",
      answer:
        "Once inside the poll, select your choice from the available options and submit your vote. Your response will be recorded instantly."
    },
    {
      question: "How do I attempt a quiz?",
      answer:
        "When you join a quiz, answer each question before the timer ends (if set). Submit your answers, and your score will be calculated automatically."
    },
    {
      question: "Can I see live results and scores?",
      answer:
        "Yes. Poll results update in real time. For quizzes, your score is displayed after submission. Hosts may also choose to show leaderboards."
    },
    {
      question: "Do I need an account?",
      answer:
        "Yes, hossts and participants need to create an account to access all features. Hosts can create and manage polls/quizzes, while participants can join and take part."
    },
    {
      question: "I'm having trouble logging in. What should I do?",
      answer:
        "Check your internet connection first. If the issue persists, reset your password or contact support."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Help Center</h1>
          <p className="text-gray-300">
            Quick guides and answers to common questions about using PollWave for polls and quizzes.
          </p>
        </section>

        {/* Getting Started */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium">For Participants</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Join a poll or quiz using a code, link shared by the host.</li>
                <li>Submit your vote instantly in polls.</li>
                <li>Answer quiz questions and view your score after submission.</li>
                <li>Check results or leaderboards if enabled by the host.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium">For Hosts</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Create an account to host polls and quizzes.</li>
                <li>Build a poll with multiple choices or a quiz with questions and correct answers.</li>
                <li>Publish and share your poll/quiz with participants via link, code.</li>
                <li>Track live poll results and quiz scores with leaderboards.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex justify-between items-center w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-800"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-4 py-3 text-gray-400 bg-gray-800">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Support</h2>
          <p className="text-gray-300">
            Still need help? Reach out to us at{" "}
            <a
              href="mailto:mysoulisinfinity1@gmail.com"
              className="text-blue-400 hover:underline"
            >
              mysoulisinfinity1@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
