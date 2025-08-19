import React from "react";
import {
  FaHome,
  FaPlus,
  FaList,
  FaChartBar,
  FaArrowLeft,
  FaSignOutAlt,
  FaPoll,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

function HostDashboard() {
  const [user, setUser] = React.useState();
  const [polls, setPolls] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/users/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error(err));
  }, []);

  React.useEffect(() => {
    const fetchMyPolls = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/users/mypolls",
          { withCredentials: true }
        );

        setPolls(response.data.polls || []);
      } catch (error) {
        console.error("Failed to fetch my polls:", error);
      }
    };
    fetchMyPolls();
  }, []);

  const handleStatusChange = async (pollId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/v1/users/polls/${pollId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setPolls((prev) =>
        prev.map((poll) =>
          poll._id === pollId ? { ...poll, status: newStatus } : poll
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#111722] overflow-x-hidden"
      style={{ fontFamily: '"Spline Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-10 px-6 flex justify-center flex-1 py-5">
          {/* add side bar if ever nedded */}

          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Welcome back, {user?.fullName || "User"}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#232f48]">
                <p className="text-white text-base font-medium leading-normal">
                  Total Created
                </p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  25
                </p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#232f48]">
                <p className="text-white text-base font-medium leading-normal">
                  Active Now
                </p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  3
                </p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#232f48]">
                <p className="text-white text-base font-medium leading-normal">
                  Average Participation
                </p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  75%
                </p>
              </div>
            </div>

            {/* My Polls Table */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              My Polls
            </h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#324467] bg-[#111722]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192233]">
                      <th className="px-4 py-3 text-center text-white w-[400px] text-sm font-medium">
                        Title
                      </th>
                      <th className="px-4 py-3 text-center text-white w-60 text-sm font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-white w-[400px] text-sm font-medium">
                        Participants
                      </th>
                      <th className="px-4 py-3 text-center text-white w-[400px] text-sm font-medium">
                        Created At
                      </th>
                      <th className="px-4 py-3 text-center text-[#92a4c9] w-60 text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {polls.map((poll, idx) => (
                      <tr key={idx} className="border-t border-t-[#324467]">
                        <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal text-center">
                          {poll.title}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal">
                          <select
                            value={poll.status}
                            onChange={(e) =>
                              handleStatusChange(poll._id, e.target.value)
                            }
                            className={`w-[140px] h-9 rounded-lg px-3 text-sm font-medium border border-[#324467] bg-[#111722] cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-[#1a2235]
                            ${poll.status === "active" ? "text-green-400" : poll.status === "closed" ? "text-red-500" : "text-gray-400"}
                            `}
                          >
                            <option
                              className="bg-[#111722] text-gray-300"
                              value="draft"
                            >
                              Draft
                            </option>
                            <option
                              className="bg-[#111722] text-green-400"
                              value="active"
                            >
                              Active
                            </option>
                            <option
                              className="bg-[#111722] text-red-400"
                              value="closed"
                            >
                              Completed
                            </option>
                          </select>
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#92a4c9] text-sm font-normal text-center">
                          {poll.participants}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#92a4c9] text-sm font-normal text-center cursor-pointer hover:underline hover:text-blue-600">
                          {new Date(poll.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-60 text-[#92a4c9] text-sm font-bold text-center tracking-[0.015em] cursor-pointer hover:underline hover:text-blue-600">
                          View
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* my quiz table */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              My quizzes
            </h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#324467] bg-[#111722]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192233]">
                      <th className="px-4 py-3 text-center text-white w-[400px] text-sm font-medium">
                        Title
                      </th>
                      <th className="px-4 py-3 text-center text-white w-60 text-sm font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-white w-[400px] text-sm font-medium">
                        Participants
                      </th>
                      <th className="px-4 py-3 text-center text-white w-[400px] text-sm font-medium">
                        Created At
                      </th>
                      <th className="px-4 py-3 text-center text-[#92a4c9] w-60 text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        title: "JavaScript Basics Quiz",
                        status: "Active",
                        participants: 120,
                        createdAt: "2023-07-20",
                      },
                    ].map((quiz, idx) => (
                      <tr key={idx} className="border-t border-t-[#324467]">
                        <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal text-center">
                          {quiz.title}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal">
                          <span
                            className={`flex items-center justify-center rounded-full h-8 px-4 text-white text-sm ${
                              quiz.status === "Active"
                                ? "bg-[#232f48]"
                                : "bg-gray-600"
                            }`}
                          >
                            {quiz.status}
                          </span>
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#92a4c9] text-sm font-normal text-center">
                          {quiz.participants}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#92a4c9] text-sm font-normal text-center cursor-pointer hover:underline hover:text-blue-600">
                          {quiz.createdAt}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-60 text-[#92a4c9] text-sm font-bold text-center tracking-[0.015em] cursor-pointer hover:underline hover:text-blue-600">
                          View
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex px-4 py-3 justify-end gap-4">
              <Link
                to="/host/create-poll"
                className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-full h-10 px-4 bg-[#135beb] text-white text-sm font-bold tracking-[0.015em]"
              >
                <span className="truncate">Create New Poll</span>
              </Link>
              <Link
                to="/host/create-quiz"
                className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-full h-10 px-4 bg-[#7f0cf2] text-white text-sm font-bold tracking-[0.015em]"
              >
                <span className="truncate">Create New Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostDashboard;
