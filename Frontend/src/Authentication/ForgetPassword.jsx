import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api.js";

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: formData.email,
        fullName: formData.fullName,
        newPassword: formData.newPassword,
      });

      setMessage(res.data.message);
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0f172a] text-white outline-none"
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0f172a] text-white outline-none"
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0f172a] text-white outline-none"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0f172a] text-white outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="text-center mt-4 text-gray-300">{message}</p>}
      </div>
    </div>
  );
}
