// src/Pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6">
      {/* Big 404 */}
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        404
      </h1>

      {/* Title */}
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>

      {/* Description */}
      <p className="text-gray-400 mt-2 text-center max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
        >
          ⬅ Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
        >
          🏠 Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
