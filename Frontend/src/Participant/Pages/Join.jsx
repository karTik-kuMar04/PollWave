import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../Component/Header';

export default function JoinPage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!code.trim()) return alert("Enter a code");
    navigate(`/poll/${code}`); // or /poll/${code}
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="border-b-1 border-white"><Header/></div>
      <div className="flex items-center justify-center min-h-screen  text-white px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-700">
          <h1 className="text-2xl font-bold text-center mb-6 tracking-tight">
            🎉 Join a Quiz or Poll
          </h1>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Code"
            className="w-full px-4 py-3 rounded-lg text-white bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            onClick={handleJoin}
            className="w-full mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white shadow-lg transition-all duration-200"
          >
            🚀 Join Now
          </button>
        </div>
      </div>
    </div>
    

  );
}
