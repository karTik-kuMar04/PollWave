import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Component/Header";

export default function JoinPage() {
  const [code, setCode] = useState("");
  const [type, setType] = useState("poll"); // default: poll
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!code.trim()) return alert("Enter a code");
    navigate(`/${type}/${code}`); // dynamic route: /poll/123 or /quiz/123
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen">
      <div className="border-b border-white">
        <Header />
      </div>

      <div className="flex items-center justify-center flex-1 text-white px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-700">
          <h1 className="text-2xl font-bold text-center mb-6 tracking-tight">
            Join a Quiz or Poll
          </h1>

          {/* Type selection */}
          <div className="flex justify-center mb-5 space-x-4">
            <button
              onClick={() => setType("poll")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                type === "poll"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              🗳️ Poll
            </button>
            <button
              onClick={() => setType("quiz")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                type === "quiz"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              🧩 Quiz
            </button>
          </div>

          {/* Code input */}
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Code"
            className="w-full px-4 py-3 rounded-lg text-white bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Join button */}
          <button
            onClick={handleJoin}
            className="w-full mt-5 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-lg font-semibold text-white shadow-lg transition-all duration-200"
          >
            Join {type === "poll" ? "Poll" : "Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
