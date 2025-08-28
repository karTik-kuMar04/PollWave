import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";


export default function WorkInProgress({
  title = "Work in progress",
  message = "This feature is currently being built. It will appear here once it's ready.",
  backTo = null,
  showHome = false,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} • PollWave`;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);

  const handleBack = () => {
    if (backTo) navigate(backTo, { replace: false });
    else navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-6">
      <div className="w-full max-w-3xl">
        <div className="rounded-2xl bg-gradient-to-br from-[#071026] to-[#0b0c14] border border-gray-800 shadow-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex items-start gap-6">
              {/* animated icon */}
              <div
                className="flex-shrink-0 w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-md"
              >

                <IoMdSettings size={40} className="text-black animate-slowspin duration-[100000ms]" />
              </div>


              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
                <p className="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed">
                  {message}
                </p>

                {/* progress placeholder */}
                <div className="mt-6">
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                    <div className="h-3 w-1/3 bg-gradient-to-r from-cyan-400 to-violet-400 animate-[progress_5s_linear_infinite]" />
                </div>
                  <p className="mt-3 text-xs text-gray-400">
                    Feature status: in development — coming soon
                  </p>
                </div>

                {/* actions */}
                <div className="mt-6 flex flex-wrap gap-3 items-center">
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-100 hover:bg-gray-700 transition"
                    aria-label="Go back"
                  >
                    Back
                  </button>

                  {showHome && (
                    <Link
                      to="/"
                      className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-400 to-violet-500 text-black text-sm font-medium shadow-sm hover:opacity-95 transition"
                    >
                      Go to Home
                    </Link>
                  )}

                  <Link
                    to="/help"
                    className="ml-auto text-sm text-gray-400 hover:text-gray-200 underline"
                  >
                    Need help or want to request this feature?
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* optional footer note */}
          
        </div>
      </div>

      {/* Inline keyframes for the progress animation (Tailwind doesn't include this by default) */}
      <style>
        {`
            @keyframes progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
                
            }
            .animate-[progress_5s_linear_infinite] {
              animation: progress 5s linear infinite alternate;
            }

            @keyframes slowspin {
              to {
                transform: rotate(360deg);
              }
            }

            .animate-slowspin {
              animation: slowspin 5s linear infinite;
            }

        `}
      </style>
    </div>
  );
}
