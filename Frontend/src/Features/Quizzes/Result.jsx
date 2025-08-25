import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api.js";


export default function Result() {
  const { quizId, resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      if (!quizId || !resultId) {
        setError("Quiz ID or Result ID missing in URL");
        setLoading(false);
        return;
      }

      try {

        const res = await axios.get(
          `${API_BASE_URL}/quizzes/${quizId}/result/${resultId}`,
          {
            withCredentials: true
          }
        );

        setResult(res.data);
      } catch (err) {
        if (err.response) {
          console.error("Server error:", err.response.data);
          setError(err.response.data?.message || "Server error");
        } else if (err.request) {
          console.error("No response:", err.request);
          setError("No response from server");
        } else {
          console.error("Axios error:", err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [quizId, resultId]);

  if (loading) return <div className="p-8 text-center text-lg">Loading…</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!result) return null;

  // compute percentage & grade
  const pct = Math.round((result.score / Math.max(result.maxScore, 1)) * 100);

  // helper to find question object by id (answers store questionId)

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg">
          <h1 className="text-3xl font-bold">{result.quiz.title}</h1>
          {result.quiz.description && (
            <p className="mt-2 text-sm text-white/80 font-bold">{result.quiz.description}</p>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Score */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-extrabold">{result.score}</div>
              <div className="text-sm uppercase tracking-wide opacity-80">
                Out of {result.maxScore}
              </div>
            </div>

            {/* Circular Progress */}
            <div className="flex items-center justify-center">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="white"
                    strokeWidth="10"
                    fill="none"
                    className="opacity-20"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke={pct >= 60 ? "#4ade80" : "#f87171"}
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={
                      2 * Math.PI * 50 - (pct / 100) * (2 * Math.PI * 50)
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-semibold">
                  {pct}%
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-center">
              <span
                className={`px-4 py-2 rounded-full font-semibold text-lg ${
                  pct >= 60
                    ? "bg-green-500/20 text-green-100 border border-green-300/30"
                    : "bg-rose-500/20 text-rose-100 border border-rose-300/30"
                }`}
              >
                {pct >= 50 ? "✅ Passed" : "❌ Needs Improvement"}
              </span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {result.answers.map((ans, i) => {
            // Find question
            const q = result.quiz.questions.find(q => q._id === ans.questionId) || {
              text: "Unknown Question",
              choices: [],
              correctChoiceIndex: null,
            };
            // Resolve texts
            const selectedText = q.choices?.[ans.selectedIndex]?.text ?? "No Answer";
            const correctText = q.choices?.[q.correctChoiceIndex]?.text ?? "—";
            const isCorrect = ans.selectedIndex === q.correctChoiceIndex;

            return (
              <div
                key={i}
                className={`p-5 rounded-xl border shadow-md transition 
                  ${isCorrect 
                    ? "bg-green-50 border-green-200 hover:shadow-green-200/50" 
                    : "bg-rose-50 border-rose-200 hover:shadow-rose-200/50"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Question */}
                    <h3 className="text-lg font-semibold text-indigo-800">
                      Q{i + 1}. {q.text}
                    </h3>

                    {/* Answer Summary */}
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full font-medium shadow-sm
                          ${isCorrect
                            ? "bg-green-100 text-green-700"
                            : "bg-rose-100 text-rose-700"}`}
                      >
                        Your Answer: {selectedText}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 shadow-sm">
                        Correct: {correctText}
                      </span>
                    </div>

                    {/* Options */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {q.choices.map((opt, idx) => {
                        const isSelected = ans?.selectedIndex === idx;
                        const isCorrect = q.correctChoiceIndex === idx;

                        return (
                          <li
                            key={opt._id}
                            className={`px-4 py-2 rounded-lg border shadow-sm transition-all duration-200 ${
                              isCorrect
                                ? "bg-green-100 border-green-400 text-green-800 font-semibold"
                                : isSelected
                                ? "bg-red-100 border-red-400 text-red-800"
                                : "bg-white border-gray-200 text-gray-800"
                            }`}
                          >
                            {opt.text}
                          </li>
                        );
                      })}
                    </div>
                  </div>

                  {/* Correct / Wrong Badge */}
                  <div className="ml-4 text-2xl font-bold">
                    {isCorrect ? "✅" : "❌"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* Footer */}
        <div className="p-4 rounded-xl bg-white shadow-md border text-gray-700 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">Taken At</div>
            <div className="font-medium">{new Date(result.createdAt).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Attempt</div>
            <div className="font-medium">#{result.attemptNumber ?? 1}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="w-full sm:w-auto px-6 h-11 rounded-full font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600"
          onClick={() => navigate("/participant/dashboard")}
        >To Home</button>
      </div>
    </div>

  );
}
