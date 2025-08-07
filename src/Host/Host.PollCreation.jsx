import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const CreatePoll = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formPreview, setFormPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

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
      title: '',
      description: '',
      options: ['', '',],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'options',
  });

  const watchedOptions = watch('options');

  const onSubmit = (data) => {
    const filledOptions = data.options.filter(opt => opt.trim() !== '');
    if (filledOptions.length < 2) {
      setError('options.root', {
        type: 'manual',
        message: 'At least 2 options are required.',
      });
      return;
    } else {
      clearErrors('options.root');
    }
    setFormPreview({ ...data, options: filledOptions });
    setShowConfirm(true);
  };

  const handleFinalSubmit = () => {
    console.log('Poll Created:', formPreview);
    setSubmitted(true);
    setShowConfirm(false);
    reset();
  };

  const handleCancel = () => {
    reset({ title: '', description: '', options: ['', '',] });
    clearErrors();
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 md:p-10">
      <h2 className="text-lg text-gray-400 font-semibold mb-2">Dashboard</h2>
      <h1 className="text-3xl font-bold mb-6">Create a New Poll</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <div>
          <label className="block mb-1 font-medium">Poll Title</label>
          <input
            type="text"
            autoComplete="off"
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., Should we implement a 4-day work week?"
            className="w-full px-4 py-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Description (optional)</label>
          <textarea
            autoComplete="off"
            {...register('description')}
            placeholder="Explain the reason for the poll or provide context."
            className="w-full px-4 py-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Poll Options (min 2, max 6)</label>
          {fields.map((field, index) => (
            <input
              key={field.id}
              autoComplete="off"
              {...register(`options.${index}`, {
                validate: value => value.trim() !== '' || 'Option is required',
              })}
              placeholder={`Option ${index + 1}`}
              className="w-full px-4 py-2 mt-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
            />
          ))}
          {errors.options?.root && <p className="text-red-500 text-sm mt-1">{errors.options.root.message}</p>}

          {fields.length < 6 && (
            <button
              type="button"
              onClick={() => append('')}
              className="mt-3 text-sm text-white bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
            >
              + Add Option
            </button>
          )}
        </div>

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

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Poll Details</h2>
            <p className="mb-2"><span className="font-semibold">Title:</span> {formPreview.title}</p>
            {formPreview.description && (
              <p className="mb-2"><span className="font-semibold">Description:</span> {formPreview.description}</p>
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

      {submitted && (
        <div className="fixed bottom-5 right-5 bg-green-700 text-white px-4 py-2 rounded shadow-lg">
          Poll created successfully! Redirecting to dashboard...
        </div>
      )}
    </div>
  );
};

export default CreatePoll;

