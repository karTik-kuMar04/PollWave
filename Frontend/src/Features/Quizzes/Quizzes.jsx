import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Quiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Fetch quiz
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/quizzes/${quizId}`, { withCredentials: true })
      .then((res) => setQuiz(res.data.quiz))
      .catch((err) => alert(err.response?.data?.message || "Failed to load quiz"));
  }, [quizId]);

  // Select answer
  const selectOption = (qId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  // Check if all questions answered
  const allAnswered =
    quiz && quiz.questions.every((q) => answers[q._id] !== undefined);

  // Submit quiz
  const submit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      })),
    };

    try {
      const res = await axios.post(
        `http://localhost:4000/api/quizzes/${quizId}/attempt`,
        payload,
        { withCredentials: true }
      );
      alert(`Score: ${res.data.result.score}/${res.data.result.maxScore}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit quiz");
    }
  };

  if (!quiz) return <div>Loading...</div>;

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111418] p-4">
      <div className="w-full max-w-md border border-[#3b4754] rounded-xl bg-[#101323] shadow-md">
        <div className="py-5 px-6">
          <h2 className="text-white text-lg font-semibold text-center mb-2">
            {currentQ.question}
          </h2>

          <div className="flex flex-col gap-3 mt-4">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-4 rounded-xl border border-solid p-4 cursor-pointer transition-colors duration-200 ${
                  answers[currentQ._id] === index
                    ? "border-green-500 bg-green-900/30"
                    : "border-[#3b4754]"
                }`}
              >
                <input
                  type="radio"
                  checked={answers[currentQ._id] === index}
                  onChange={() => selectOption(currentQ._id, index)}
                  className="h-5 w-5 text-green-500 focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
                <p className="text-white text-sm font-medium leading-normal">
                  {option}
                </p>
              </label>
            ))}
          </div>

          {/* Question Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {quiz.questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-bold transition-colors duration-200 ${
                  currentQuestion === index
                    ? "bg-blue-500 text-white"
                    : answers[q._id] !== undefined
                    ? "bg-green-500 text-white"
                    : "bg-[#3b4754] text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              disabled={!allAnswered}
              onClick={submit}
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
