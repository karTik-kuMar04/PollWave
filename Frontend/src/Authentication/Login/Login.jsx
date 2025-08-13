import React, { useState } from "react";

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 py-3 rounded font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400">
          Don’t have an account?{" "}
          <a href="/registration" className="text-green-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

