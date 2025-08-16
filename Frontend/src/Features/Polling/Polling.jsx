import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PollCard = () => {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);
  const [loading, setLoading] = useState(false);

  const { pollId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/users/polls/${pollId}`)
      .then((res) => setPoll(res.data.poll))
      .catch((err) => console.error(err));
  }, [pollId]);

  const onToggleOption = (optionId) => {
    if (poll.type === "single-choice") {
      setSelectedOption([optionId]); // ✅ fix
    } else {
      setSelectedOption((prev) =>
        prev.includes(optionId)
          ? prev.filter((x) => x !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const onSubmit = async () => {
    if (selectedOption.length === 0) {
      return alert("Please select an option");
    }
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:4000/api/v1/users/polls/${pollId}/respond`,
        { selectedOption },
        { withCredentials: true }
      );
      alert("✅ Response recorded");

      // refresh poll
      const refreshed = await axios.get(
        `http://localhost:4000/api/v1/users/polls/${pollId}`
      );
      setPoll(refreshed.data.poll);
      setSelectedOption([]); // reset after vote
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (!poll) return <div className="text-white text-center p-4">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111418] p-4">
      <div className="w-full max-w-md border border-[#3b4754] rounded-xl bg-[#101323] shadow-md">
        <div className="py-5 px-6">
          <p className="text-white text-sm font-normal text-center mb-1">
            Hosted by: {poll.host?.name || "Unknown"}
          </p>
          <h2 className="text-white text-lg font-semibold text-center mb-2">
            {poll.question}
          </h2>
          <p className="text-[#cbd5e1] text-sm text-center mb-4">
            Share your preference in this quick poll.
          </p>

          <div className="flex flex-col gap-3">
            {poll.options.map((option) => (
              <label
                key={option._id}
                className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors duration-200 ${
                  selectedOption.includes(option._id)
                    ? "border-green-500 bg-green-900/30"
                    : "border-[#3b4754]"
                }`}
              >
                <input
                  type={poll.type === "single-choice" ? "radio" : "checkbox"}
                  checked={selectedOption.includes(option._id)}
                  onChange={() => onToggleOption(option._id)}
                  className="h-5 w-5 text-green-500 focus:outline-none"
                />
                <p className="text-white text-sm font-medium leading-normal">
                  {option.text}
                </p>
              </label>
            ))}
          </div>

          <div className="flex justify-center mt-5">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Vote"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollCard;
