import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

const CreatePoll = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formPreview, setFormPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control,
  });

  const watchedOptions = watch("options");

  // Step 1: handle form submit -> show preview modal
  const onSubmit = (data) => {
    const filledOptions = data.options
      .map((opt) => opt.text.trim())
      .filter((opt) => opt !== "");

    if (filledOptions.length < 2) {
      setError("options.root", {
        type: "manual",
        message: "At least 2 options are required.",
      });
      return;
    } else {
      clearErrors("options.root");
    }

    setFormPreview({ ...data, options: filledOptions });
    setShowConfirm(true);
  };

  // Step 2: Final API call
  const handleFinalSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/users/polls",
        {
          title: formPreview.title,
          description: formPreview.description,
          options: formPreview.options,
        },
        { withCredentials: true }
      );

      setSubmitted(true);
      setShowConfirm(false);
      reset();
      setTimeout(() => navigate("/host/dashboard"), 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create poll");
    }
  };

  const handleCancel = () => {
    reset({
      title: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
    });
    clearErrors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-700">
        <h2 className="text-lg text-gray-300 font-semibold mb-2">
          ✨ Dashboard
        </h2>
        <h1 className="text-3xl font-bold mb-6">📊 Create a New Poll</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Poll Title</label>
            <input
              type="text"
              autoComplete="off"
              {...register("title", { required: "Title is required" })}
              placeholder="e.g., Should we implement a 4-day work week?"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">
              Description (optional)
            </label>
            <textarea
              autoComplete="off"
              {...register("description")}
              placeholder="Explain the reason for the poll or provide context."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block mb-2 font-medium">
              Poll Options (min 2, max 6)
            </label>
            {fields.map((field, index) => (
              <input
                key={field.id}
                autoComplete="off"
                {...register(`options.${index}.text`, {
                  validate: (value) =>
                    value.trim() !== "" || "Option is required",
                })}
                placeholder={`Option ${index + 1}`}
                className="w-full px-4 py-3 mt-2 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            ))}
            {errors.options?.root && (
              <p className="text-red-400 text-sm mt-1">
                {errors.options.root.message}
              </p>
            )}

            {fields.length < 6 && (
              <button
                type="button"
                onClick={() => append({ text: "" })}
                className="mt-3 text-sm text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-md transition-all"
              >
                + Add Option
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
            >
              🚀 Create Poll
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">✅ Confirm Poll Details</h2>
            <p className="mb-2">
              <span className="font-semibold">Title:</span> {formPreview.title}
            </p>
            {formPreview.description && (
              <p className="mb-2">
                <span className="font-semibold">Description:</span>{" "}
                {formPreview.description}
              </p>
            )}
            <p className="mb-2 font-semibold">Options:</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              {formPreview.options.map((opt, idx) => (
                <li key={idx}>{opt}</li>
              ))}
            </ul>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow-md"
              >
                ✅ Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {submitted && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md animate-bounce">
          🎉 Poll created successfully! Redirecting to dashboard...
        </div>
      )}
    </div>
  );
};

export default CreatePoll;
