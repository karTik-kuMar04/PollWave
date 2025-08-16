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

  // Handle initial form submission -> Show preview modal
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

  // Final API call
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
    <div className="min-h-screen bg-[#121212] text-white p-6 md:p-10">
      <h2 className="text-lg text-gray-400 font-semibold mb-2">Dashboard</h2>
      <h1 className="text-3xl font-bold mb-6">Create a New Poll</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Poll Title</label>
          <input
            type="text"
            autoComplete="off"
            {...register("title", { required: "Title is required" })}
            placeholder="e.g., Should we implement a 4-day work week?"
            className="w-full px-4 py-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description (optional)</label>
          <textarea
            autoComplete="off"
            {...register("description")}
            placeholder="Explain the reason for the poll or provide context."
            className="w-full px-4 py-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block mb-2 font-medium">Poll Options (min 2, max 6)</label>
          {fields.map((field, index) => (
            <input
              key={field.id}
              autoComplete="off"
              {...register(`options.${index}.text`, {
                validate: (value) =>
                  value.trim() !== "" || "Option is required",
              })}
              placeholder={`Option ${index + 1}`}
              className="w-full px-4 py-2 mt-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
            />
          ))}
          {errors.options?.root && (
            <p className="text-red-500 text-sm mt-1">
              {errors.options.root.message}
            </p>
          )}

          {fields.length < 6 && (
            <button
              type="button"
              onClick={() => append({ text: "" })}
              className="mt-3 text-sm text-white bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
            >
              + Add Option
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
          >
            Create Poll
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Poll Details</h2>
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
            <ul className="list-disc list-inside mb-4">
              {formPreview.options.map((opt, idx) => (
                <li key={idx}>{opt}</li>
              ))}
            </ul>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {submitted && (
        <div className="fixed bottom-5 right-5 bg-green-700 text-white px-4 py-2 rounded shadow-lg">
          Poll created successfully! Redirecting to dashboard...
        </div>
      )}
    </div>
  );
};

export default CreatePoll;
