import React, { useState } from "react";

const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
  },
  {
    question: "What is the boiling point of water?",
    options: ["90°C", "100°C", "110°C", "120°C"],
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
  },
  {
    question: "What is the square root of 64?",
    options: ["6", "7", "8", "9"],
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Gd", "Go"],
  },
  {
    question: "Which continent is the Sahara Desert located on?",
    options: ["Asia", "Africa", "Australia", "Europe"],
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(quizData.length).fill(null));

  const handleOptionChange = (optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const allAnswered = answers.every((answer) => answer !== null);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111418] p-4">
      <div className="w-full max-w-md border border-[#3b4754] rounded-xl bg-[#101323] shadow-md">
        <div className="py-5 px-6">
          <h2 className="text-white text-lg font-semibold text-center mb-2">
            {quizData[currentQuestion].question}
          </h2>

          <div className="flex flex-col gap-3 mt-4">
            {quizData[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-4 rounded-xl border border-solid p-4 cursor-pointer transition-colors duration-200 ${
                  answers[currentQuestion] === index
                    ? "border-green-500 bg-green-900/30"
                    : "border-[#3b4754]"
                }`}
              >
                <input
                  type="radio"
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleOptionChange(index)}
                  className="h-5 w-5 text-green-500 focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
                <p className="text-white text-sm font-medium leading-normal">
                  {option}
                </p>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {quizData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-bold transition-colors duration-200 ${
                  currentQuestion === index
                    ? "bg-blue-500 text-white"
                    : answers[index] !== null
                    ? "bg-green-500 text-white"
                    : "bg-[#3b4754] text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button
              disabled={!allAnswered}
              className={`flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-full h-10 px-6 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-opacity duration-300 ${
                allAnswered
                  ? "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
                  : "bg-gradient-to-r from-green-400 to-blue-500 cursor-not-allowed opacity-50"
              }`}
            >
              <span className="truncate">Submit Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;