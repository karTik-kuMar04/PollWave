import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../api.js";

const PollCard = () => {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { pollId } = useParams();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/polls/${pollId}`, { withCredentials: true })
      .then((res) => {
        setPoll(res.data.poll);
        setSelectedOption(null); // only one option allowed
      })
      .catch((err) => console.error(err));
  }, [pollId]);

  const onToggleOption = (optionId) => {
    setSelectedOption(optionId); // always one option
  };

  const onSubmit = async () => {
    if (!selectedOption) {
      return alert("Please select an option");
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/polls/${pollId}/respond`,
        { selectedOptionIds: [selectedOption] }, // single string only
        { withCredentials: true }
      );
      alert("✅ Response recorded");

      // redirect to dashboard after submission
      navigate("/participant/dashboard");
      
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
            <span className="italic">Hosted by:</span> {poll.host?.fullName || "Unknown"}
          </p>
          <h2 className="text-white text-lg font-semibold text-center mb-2">
            {poll.title}
          </h2>
          <p className="text-[#cbd5e1] text-sm text-center mb-4">
            {poll.description || "No description provided."}
          </p>

          <div className="flex flex-col gap-3">
            {poll.options.map((option) => (
              <label
                key={option._id}
                className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors duration-200 ${
                  selectedOption === option._id
                    ? "border-green-500 bg-green-900/30"
                    : "border-[#3b4754]"
                }`}
              >
                <input
                  type="radio" // 🔥 only radio
                  checked={selectedOption === option._id}
                  onChange={() => onToggleOption(option._id)}
                  className="h-5 w-5 text-green-500 focus:outline-none"
                  name="pollOption" // 🔥 ensures only one selectable
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
