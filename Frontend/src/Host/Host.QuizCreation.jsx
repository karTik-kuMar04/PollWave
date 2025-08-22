import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../api.js";


export default function CreateQuizEnhanced() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formPreview, setFormPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPreviewIndex, setOpenPreviewIndex] = useState(null);
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

  const onSubmit = (data) => {
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

    const transformedData = {
      title: data.title,
      description: data.description || "",
      questions: data.questions.map((q) => ({
        text: q.question,
        choices: q.options.map(c => ({ text: c })),
        correctChoiceIndex: Number(q.answer),
        points: 1,
      })),
    };

    setFormPreview(transformedData);
    setShowConfirm(true);
  };

  const handleFinalSubmit = async () => {
    if (!formPreview) return;
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/quizzes`,
        formPreview,
        { withCredentials: true }
      );

      setSubmitted(true);
      setShowConfirm(false);
      reset();

      // small delay so user sees success toast
      setTimeout(() => navigate("/host/dashboard"), 1200);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  // helper for progress %
  const progress = Math.min(100, Math.round((fields.length / 10) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT: form (3 cols on lg) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm uppercase tracking-wider text-gray-400">Dashboard</h2>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">Create a New Quiz</h1>
              <p className="text-gray-300 mt-1 text-sm">Make a short, engaging quiz — keep questions clear and concise.</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => {
                  append({ question: "", options: ["", "", "", ""], answer: "" });
                }}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md shadow"
              >
                + Question
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-700">
              <label className="block mb-2 font-medium text-sm text-gray-200">Quiz Title</label>
              <input
                type="text"
                autoComplete="off"
                {...register("title", { required: "Title is required" })}
                placeholder="e.g., JavaScript Basics Quiz"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              />
              {errors.title && <p className="text-red-400 text-sm mt-2">{errors.title.message}</p>}
            </div>

            <div className="bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-700">
              <label className="block mb-2 font-medium text-sm text-gray-200">Description (optional)</label>
              <textarea
                autoComplete="off"
                {...register("description")}
                placeholder="Short summary to help participants understand the quiz context"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white resize-none"
                rows={3}
              />
            </div>

            {/* Questions list */}
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="bg-gradient-to-r from-gray-800/60 to-gray-800/30 p-5 rounded-2xl border border-gray-700 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-200">Question {index + 1}</label>
                    <input
                      type="text"
                      autoComplete="off"
                      {...register(`questions.${index}.question`, { required: "Question title is required" })}
                      placeholder="Enter your question"
                      className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                    />
                    {errors.questions?.[index]?.question && (
                      <p className="text-red-400 text-sm mt-2">{errors.questions[index].question.message}</p>
                    )}

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[0, 1, 2, 3].map((optIdx) => (
                        <input
                          key={optIdx}
                          type="text"
                          autoComplete="off"
                          {...register(`questions.${index}.options.${optIdx}`, { required: "All options are required" })}
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                        />
                      ))}
                    </div>
                    {errors.questions?.[index]?.options && <p className="text-red-400 text-sm mt-2">{errors.questions[index].options.message}</p>}

                    <div className="mt-3 flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-200">Correct Answer</label>
                      <select
                        {...register(`questions.${index}.answer`, { required: "Correct answer is required" })}
                        className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                      >
                        <option value="">-- Select Correct Answer --</option>
                        <option value="0">Option A</option>
                        <option value="1">Option B</option>
                        <option value="2">Option C</option>
                        <option value="3">Option D</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="ml-auto text-sm text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex items-center gap-3">
              {fields.length < 10 && (
                <button
                  type="button"
                  onClick={() => append({ question: "", options: ["", "", "", ""], answer: "" })}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow"
                >
                  + Add Question
                </button>
              )}

              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold shadow"
                >
                  Preview
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT: Sidebar (1 col on lg) */}
        <aside className="lg:col-span-1 sticky top-6 self-start">
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-200">Quiz Summary</h3>
            <p className="text-xs text-gray-400 mt-1">Questions: <span className="font-medium">{fields.length}</span></p>

            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-2">Progress: <span className="font-medium">{progress}%</span></p>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  if (fields.length < 10) append({ question: "", options: ["", "", "", ""], answer: "" });
                }}
                className="w-full text-sm bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg"
              >
                Add Question
              </button>

              <button
                onClick={() => {
                  // quick preview if possible
                  if (fields.length === 0) return;
                  // build quick preview from current form values by triggering submit handler.
                  // For simplicity user can click Preview on form after editing.
                }}
                className="w-full text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
              >
                Open Preview
              </button>
            </div>
          </div>

          <div className="mt-4 bg-gray-800 p-4 rounded-2xl border border-gray-700">
            <h4 className="text-sm font-semibold text-gray-200">Tips</h4>
            <ul className="text-xs text-gray-400 mt-2 list-disc list-inside space-y-1">
              <li>Keep questions short.</li>
              <li>Provide distinct options (avoid duplicates).</li>
              <li>Use images later to increase engagement.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Confirm Modal with collapsible Qs */}
      <AnimatePresence>
        {showConfirm && formPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-xl border border-gray-700">
              <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-300">Confirm Quiz</h3>
                  <p className="text-xs text-gray-400">Review before publishing</p>
                </div>
                <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-white">Close</button>
              </div>

              <div className="p-5 overflow-y-auto max-h-[60vh]">
                <p className="text-sm text-gray-200"><span className="font-semibold">Title:</span> {formPreview.title}</p>
                {formPreview.description && <p className="text-sm text-gray-300 mt-2"><span className="font-semibold">Description:</span> {formPreview.description}</p>}

                <div className="mt-4 space-y-3">
                  {formPreview.questions.map((q, i) => (
                    <div key={i} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-100">Q{i + 1}: {q.text}</p>
                          <div className="text-sm text-gray-300 mt-2 space-y-1">
                            {q.choices.map((c, idx) => (
                              <div key={idx} className={`flex items-center gap-2 ${q.correctChoiceIndex === idx ? 'text-green-300 font-medium' : 'text-gray-300'}`}>
                                <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-gray-700 text-xs">{String.fromCharCode(65 + idx)}</span>
                                <span>{typeof c === "string" ? c : c.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4">
                          <button onClick={() => setOpenPreviewIndex(openPreviewIndex === i ? null : i)} className="text-sm text-indigo-300">{openPreviewIndex === i ? 'Hide' : 'Expand'}</button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {openPreviewIndex === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 p-3 bg-gray-900 rounded">
                            <p className="text-xs text-gray-400">Points: {q.points ?? 1}</p>
                            <p className="text-xs text-gray-400">Correct: Option {String.fromCharCode(65 + q.correctChoiceIndex)}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-800 flex items-center justify-end gap-3">
                <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-700 rounded-md">Edit</button>
                <button onClick={handleFinalSubmit} disabled={loading} className={`px-4 py-2 rounded-md ${loading ? 'bg-green-500/60' : 'bg-green-600 hover:bg-green-700'}`}>
                  {loading ? 'Publishing...' : 'Confirm & Publish'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg">
            ✅ Quiz created successfully — redirecting...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
