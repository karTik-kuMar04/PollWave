import React, { useState, useEffect } from "react";

const PollCard = () => {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // Simulating API call
    const examplePoll = {
      question: "What's your favorite type of vacation?",
      host: "Emily Carter",
      options: [
        "Beach Getaway",
        "Mountain Retreat",
        "City Exploration",
        "Cruise Adventure",
        "Camping Trip",
      ],
    };
    setPoll(examplePoll);
  }, []);

  const handleChange = (index) => {
    setSelectedOption(index);
  };

  if (!poll) return <div className="text-white text-center p-4">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111418] p-4">
      <div className="w-full max-w-md border border-[#3b4754] rounded-xl bg-[#101323] shadow-md">
        <div className="py-5 px-6">
          <p className="text-white text-sm font-normal text-center mb-1">
            Hosted by: {poll.host}
          </p>
          <h2 className="text-white text-lg font-semibold text-center mb-2">
            {poll.question}
          </h2>
          <p className="text-[#cbd5e1] text-sm text-center mb-4">
            Share your preference in this quick poll.
          </p>

          <div className="flex flex-col gap-3">
            {poll.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-4 rounded-xl border border-solid p-4 cursor-pointer transition-colors duration-200 ${
                  selectedOption === index
                    ? "border-green-500 bg-green-900/30"
                    : "border-[#3b4754]"
                }`}
              >
                <input
                  type="radio"
                  checked={selectedOption === index}
                  onChange={() => handleChange(index)}
                  className="h-5 w-5 text-green-500 focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
                <p className="text-white text-sm font-medium leading-normal">
                  {option}
                </p>
              </label>
            ))}
          </div>

          <div className="flex justify-center mt-5">
            <button className="flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Submit Vote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollCard;

