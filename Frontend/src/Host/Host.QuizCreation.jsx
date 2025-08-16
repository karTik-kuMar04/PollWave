import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateQuiz = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formPreview, setFormPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          answer: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data) => {
    const isValid = data.questions.every((q, i) => {
      const filledOptions = q.options.filter((opt) => opt.trim() !== "");
      if (!q.question.trim()) {
        setError(`questions.${i}.question`, {
          type: "manual",
          message: "Question title is required.",
        });
        return false;
      }
      if (filledOptions.length !== 4) {
        setError(`questions.${i}.options`, {
          type: "manual",
          message: "All 4 options are required.",
        });
        return false;
      }
      if (q.answer === "") {
        setError(`questions.${i}.answer`, {
          type: "manual",
          message: "Select the correct answer.",
        });
        return false;
      }
      return true;
    });

    if (!isValid) return;

    setFormPreview(data);
    setShowConfirm(true);

    // 🔥 Transform questions properly
    const questions = data.questions.map((q) => ({
      text: q.question,
      choices: q.options,
      correctChoiceIndex: Number(q.answer),
      points: 1, // optional
    }));

    try {
      await axios.post(
        "http://localhost:4000/api/host/quizzes",
        { title: data.title, description: data.description, questions },
        { withCredentials: true }
      );
      navigate("/host/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create quiz");
    }
  };

  const handleFinalSubmit = () => {
    console.log("Quiz Created:", formPreview);
    setSubmitted(true);
    setShowConfirm(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 md:p-10 overflow-hidden">
      <h2 className="text-lg text-gray-400 font-semibold mb-2">Dashboard</h2>
      <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div>
          <label className="block mb-1 font-medium">Quiz Title</label>
          <input
            type="text"
            autoComplete="off"
            {...register("title", { required: "Title is required" })}
            placeholder="e.g., JavaScript Basics Quiz"
            className="w-full px-4 py-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Description (optional)
          </label>
          <textarea
            autoComplete="off"
            {...register("description")}
            placeholder="Give an overview of the quiz."
            className="w-full px-4 py-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
          />
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-700 p-4 rounded-md bg-[#1a1a1a] space-y-4 overflow-hidden"
          >
            <div>
              <label className="block font-medium">Question {index + 1}</label>
              <input
                type="text"
                autoComplete="off"
                {...register(`questions.${index}.question`, {
                  required: "Question title is required",
                })}
                placeholder="Enter your question"
                className="w-full px-4 py-2 mt-1 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
              />
              {errors.questions?.[index]?.question && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questions[index].question.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Options</label>
              {[0, 1, 2, 3].map((optIdx) => (
                <input
                  key={optIdx}
                  type="text"
                  autoComplete="off"
                  {...register(`questions.${index}.options.${optIdx}`, {
                    required: "All options are required",
                  })}
                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                  className="w-full px-4 py-2 mt-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
                />
              ))}
              {errors.questions?.[index]?.options && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questions[index].options.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Correct Answer</label>
              <select
                {...register(`questions.${index}.answer`, {
                  required: "Correct answer is required",
                })}
                className="w-full px-4 py-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
              >
                <option value="">-- Select Correct Answer --</option>
                <option value="0">Option A</option>
                <option value="1">Option B</option>
                <option value="2">Option C</option>
                <option value="3">Option D</option>
              </select>
              {errors.questions?.[index]?.answer && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questions[index].answer.message}
                </p>
              )}
            </div>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Question
              </button>
            )}
          </div>
        ))}

        {fields.length < 10 && (
          <button
            type="button"
            onClick={() =>
              append({ question: "", options: ["", "", "", ""], answer: "" })
            }
            className="text-sm text-white bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
          >
            + Add Question
          </button>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
          >
            Create Quiz
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="overflow-y-auto pr-2 flex-1">
              <h2 className="text-xl font-bold mb-4 sticky top-0 bg-[#1e1e1e] pb-2">
                Confirm Quiz Details
              </h2>
              <p className="mb-2">
                <span className="font-semibold">Title:</span>{" "}
                {formPreview.title}
              </p>
              {formPreview.description && (
                <p className="mb-2">
                  <span className="font-semibold">Description:</span>{" "}
                  {formPreview.description}
                </p>
              )}
              <div className="mb-4">
                {formPreview.questions.map((q, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-semibold">
                      Q{i + 1}: {q.question}
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      {q.options.map((opt, idx) => (
                        <li key={idx}>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </li>
                      ))}
                    </ul>
                    <p className="text-green-400 text-sm mt-1">
                      Correct Answer: Option{" "}
                      {String.fromCharCode(65 + parseInt(q.answer))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="sticky bottom-0 bg-[#1e1e1e] pt-4 flex justify-end gap-3">
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

      {submitted && (
        <div className="fixed bottom-5 right-5 bg-green-700 text-white px-4 py-2 rounded shadow-lg">
          Quiz created successfully! Redirecting to dashboard...
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
