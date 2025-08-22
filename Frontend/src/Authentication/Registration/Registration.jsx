import React from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios"
import { API_BASE_URL } from "../../api.js";

export default function Registration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const role = searchParams.get("role");
  const Navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  function handleSelectRole(selectedRole) {
    searchParams.set("role", selectedRole);
    setSearchParams(searchParams);
    setValue("role", selectedRole, { shouldValidate: true });
  }

  async function onSubmit(data) {
    const isRoleValid = await trigger("role");

    if (!isRoleValid) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/register`,
        {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: data.role
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      )

      const role = res.data.data.user.role;

      // redirect based on their role
      if (role === "host") {
        Navigate("/host/dashboard");
      } else {
        Navigate("/participant/dashboard");
      }
    } catch (error) {
      if (error.response) {
        console.error("Backend error:", error.response.data);
        alert("❌ " + (error.response.data.message || "Registration failed"));
      } else {
        console.error("Axios error:", error.message);
        alert("❌ " + error.message);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center">Register</h1>

        {/* Full Name */}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            autoComplete="off"
            className="w-full px-4 py-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            {...register("fullName", {
              required: "fullname is required",
              minLength: { value: 4, message: "Min length should be 4" },
              maxLength: { value: 15, message: "Max length should be 15" },
              pattern: {
                value: /^[A-Za-z0-9@._-]+$/,
                message: "Only letters, numbers, and @ . _ - allowed",
              },
            })}
          />
          {errors.fullName && (
            <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email address"
            autoComplete="off"
            className="w-full px-4 py-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Create password"
            className="w-full px-4 py-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Min. 6 characters",
              },
              maxLength: {
                value: 10,
                message: "Max 10 characters allowed",
              },
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                message:
                  "Must include 1 letter, 1 number, and 1 special character",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Role Buttons */}
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={() => handleSelectRole("host")}
            className={`w-1/2 py-2 rounded font-semibold transition 
              ${role === "host"
                ? "bg-green-500 text-white"
                : "bg-gray-700 hover:bg-gray-600"}`}
          >
            Host
          </button>
          <button
            type="button"
            onClick={() => handleSelectRole("participant")}
            className={`w-1/2 py-2 rounded font-semibold transition 
              ${role === "participant"
                ? "bg-green-500 text-white"
                : "bg-gray-700 hover:bg-gray-600"}`}
          >
            Participant
          </button>
        </div>
        <input
          type="hidden"
          {...register("role", { required: "Role is required" })}
        />
        {errors.role && (
          <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>
        )}

        {/* Submit Button */}
        <div>
          <input
            type="submit"
            value={isSubmitting ? "Registering..." : "Register"}
            disabled={isSubmitting || !role}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 py-3 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </form>
    </div>
  );
}

