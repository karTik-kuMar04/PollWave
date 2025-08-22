import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Quiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Fetch quiz
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/users/quiz/${quizId}`, {
        withCredentials: true,
      })
      .then((res) => setQuiz(res.data.quiz))
      .catch((err) =>
        alert(err.response?.data?.message || "Failed to load quiz")
      );
  }, [quizId]);

  // Select answer
  const selectOption = (qId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  // Check if all questions answered
  const allAnswered =
    quiz && quiz.questions.every((q) => answers[q._id] !== undefined);

  // Submit quiz
  const navigate = useNavigate();

  const submit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      })),
    };

    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/users/quizzes/${quizId}/respond`,
        payload,
        { withCredentials: true }
      );

      // redirect to result page with responseId
      navigate(`/quiz/${quizId}/result/${res.data.result._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit quiz");
    }
  };

  if (!quiz) return <div className="text-white text-center">Loading...</div>;

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0d1117] to-[#111418] p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-[#101323] shadow-xl border border-[#2b3441] overflow-hidden">
        
        {/* Quiz Header */}
        <div className="px-6 py-5 border-b border-[#2b3441] text-center">
          <h1 className="text-2xl font-bold text-white mb-2">{quiz.title}</h1>
          <p className="text-gray-400 text-sm">{quiz.description}</p>
        </div>

        {/* Question Section */}
        <div className="px-6 py-6">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            Q{currentQuestion + 1}. {currentQ.text}
          </h2>

          <div className="flex flex-col gap-3">
            {currentQ?.choices?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                  answers[currentQ._id] === index
                    ? "border-green-500 bg-green-900/30"
                    : "border-[#3b4754] hover:border-blue-500/50"
                }`}
              >
                <input
                  type="radio"
                  checked={answers[currentQ._id] === index}
                  onChange={() => selectOption(currentQ._id, index)}
                  className="h-5 w-5 text-green-500 focus:outline-none focus:ring-0"
                />
                <p className="text-white text-sm">{option.text}</p>
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
              className={`w-full sm:w-auto px-6 h-11 rounded-full font-semibold text-sm transition-all duration-300 ${
                allAnswered
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
