import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const navigate = useNavigate(); // lowercase variable name
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/users/login",
        data,
        { withCredentials: true }
      );

      alert("✅ Login Successful!");

      // Redirect as per role
      const role = res.data.data.user.role;

      if (role === "host") {
        navigate("/host/dashboard");
      } else if (role === "participant") {
        navigate("/participant/dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        alert(`❌ ${err.response.data.message}`);
      } else {
        alert("❌ Something went wrong");
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
            />
            {errors.email && <p className="text-red-400">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
            {errors.password && <p className="text-red-400">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 py-3 rounded font-semibold transition"
          >
            {isSubmitting ? "Logging in..." : "Login"}
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
