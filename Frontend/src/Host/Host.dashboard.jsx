import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { API_BASE_URL } from "../api.js";

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState("polls"); // 'polls' | 'quizzes' | 'both'
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

  const [user, setUser] = React.useState();
  const [polls, setPolls] = React.useState([]);
  const [quizzes, setQuizzes] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(`${API_BASE_URL}/me`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pollRes, quizRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/mypolls`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/myquiz`, { withCredentials: true }),
        ]);

        setPolls(pollRes.data.polls || []);
        setQuizzes(quizRes.data.quizzes || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePollStatusChange = async (pollId, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/polls/${pollId}/status`,
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

  const handleQuizStatusChange = async (quizId, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/quizzes/${quizId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setQuizzes((prev) =>
        prev.map((q) =>
          q._id === quizId ? { ...q, status: newStatus } : q
        )
      );
    } catch (error) {
      console.error("Error updating quiz status:", error);
    }
  };

  const totalPollParticipants = polls.reduce(
    (sum, p) => sum + (p.participants ?? 0),
    0
  );

  const totalQuizParticipants = quizzes.reduce(
    (sum, q) => sum + (q.participantsCount ?? 0),
    0
  );

  const totalResponses = totalPollParticipants + totalQuizParticipants;

  // logout
  const handleLogOut = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        { withCredentials: true } // must include this!
      );

      // Remove client-side stored user data
      localStorage.removeItem("user");

      // Use replace so back button doesn’t go back to dashboard
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-gray-900 text-gray-100">
        <div className="w-6 h-6 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex h-full">
        {/* MAIN */}
        <main className="flex-1">
          {/* HEADER */}
          <header className="sticky top-0 z-10 bg-[#0b0b12] border-b border-gray-800">
            <div className="flex items-center justify-between gap-4 p-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 rounded-lg flex items-center justify-center text-black font-bold shadow-lg">
                  PW
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-300">PollWave</h3>
                  <p className="text-xs text-gray-400">Host Dashboard</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex gap-2">
                  <Link
                    to="/host/create-poll"
                    className="px-3 py-2 rounded bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-medium shadow-md transform hover:scale-[1.02]"
                  >
                    Create Poll
                  </Link>
                  <Link
                    to="/host/create-quiz"
                    className="px-3 py-2 rounded bg-gradient-to-r from-lime-300 to-amber-400 text-black font-medium shadow-md transform hover:scale-[1.02]"
                  >
                    Create Quiz
                  </Link>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenMenu((s) => !s)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-700 bg-[#0f1222] rounded hover:shadow-[0_4px_18px_rgba(0,0,0,0.6)]"
                  >
                    <span className="w-7 h-7 bg-gradient-to-br from-violet-500 to-pink-400 rounded-full flex items-center justify-center text-sm font-semibold text-black">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden sm:block text-cyan-200">{user?.fullName}</span>
                  </button>
                  {openMenu && (
                    <div
                      onMouseLeave={() => setOpenMenu(false)}
                      className="absolute right-0 mt-2 w-44 rounded-lg border border-[#1c1e32] bg-gradient-to-b from-[#0f1222] to-[#0b0d18] shadow-xl overflow-hidden"
                    >
                      <NavLink
                        to="/work/progress"
                        className="block px-3 py-2 text-sm text-gray-200 hover:bg-[#111126]"
                      >
                        Settings
                      </NavLink>
                      <button
                        onClick={handleLogOut}
                        className="w-full text-left px-3 py-2 text-sm text-pink-300 hover:bg-[#22061a]"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="max-w-7xl mx-auto p-6">
            {/* STATS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard
                title="Total Polls"
                value={polls?.length}
                subtitle="Active & drafts"
                gradient="from-cyan-500/30 to-blue-600/40"
              />
              <StatCard
                title="Total Quizzes"
                value={quizzes?.length}
                subtitle="Published & scheduled"
                gradient="from-purple-500/30 to-pink-600/40"
              />
              <StatCard
                title="Responses"
                value={totalResponses}
                subtitle="All time"
                gradient="from-emerald-500/30 to-teal-600/40"
              />
            </section>

            {/* TAB TOGGLE */}
            <section className="bg-[#0c0c14] p-4 rounded shadow-sm mb-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tab
                    label="Polls"
                    active={activeTab === "polls"}
                    onClick={() => setActiveTab("polls")}
                    color="cyan"
                  />
                  <Tab
                    label="Quizzes"
                    active={activeTab === "quizzes"}
                    onClick={() => setActiveTab("quizzes")}
                    color="violet"
                  />
                  <Tab
                    label="Both"
                    active={activeTab === "both"}
                    onClick={() => setActiveTab("both")}
                    color="lime"
                  />
                </div>

                <div className="text-sm text-gray-400">
                  Showing: <strong className="text-cyan-200">{activeTab}</strong>
                </div>
              </div>

              <div className="mt-4">
                {(activeTab === "polls" || activeTab === "both") && (
                  <ListSection
                    title="Polls"
                    items={polls}
                    type="poll"
                    onStatusChange={handlePollStatusChange}
                  />
                )}

                {(activeTab === "quizzes" || activeTab === "both") && (
                  <div className="mt-6">
                    <ListSection
                      title="Quizzes"
                      items={quizzes}
                      type="quiz"
                      onStatusChange={handleQuizStatusChange}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, gradient }) {
  return (
    <div 
      className={`p-4 rounded-lg border border-gray-800 shadow-lg flex items-center justify-between bg-gradient-to-br ${gradient}`}
    >
      <div>
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-2xl font-extrabold mt-1 text-white">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick, color = "cyan" }) {
  // color: 'cyan' | 'violet' | 'lime' etc.
  const colorMap = {
    cyan: "from-cyan-400 to-cyan-600",
    violet: "from-violet-400 to-violet-600",
    lime: "from-lime-300 to-lime-500",
  };
  const gradient = colorMap[color] || colorMap.cyan;

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded border border-gray-700 text-sm font-medium ${
        active
          ? `bg-gradient-to-r ${gradient} text-black shadow-md`
          : "bg-transparent text-gray-300 hover:bg-[#11121a]"
      }`}
    >
      {label}
    </button>
  );
}

function ListSection({ title, items, type = "poll", onStatusChange }) {
  const statusOptions = ["draft", "active", "closed"];

  const handleCopyLink = (id) => {
    // Copy a full participant URL to clipboard
    const shareUrl = `${window.location.origin}/participant/${type}/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      // small non-blocking toast alternative — using alert for demo
      alert("Link copied! Share it with participants.");
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-200">{title}</h3>
      <div className="mt-3 space-y-3">
        {items.length === 0 && (
          <div className="text-sm text-gray-400">No {title.toLowerCase()} found.</div>
        )}
        {items.map((it, idx) => (
          <div
            key={idx}
            className="p-3 border border-gray-800 rounded-lg flex items-center justify-between bg-gradient-to-br from-[#071026] to-[#08101a] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transform hover:-translate-y-0.5 transition"
          >
            <div>
              <div className="font-medium text-white">{it.title}</div>
              <div className="text-xs text-gray-400">
                {type === "poll"
                  ? `${it.participants ?? 0} responses`
                  : `${it.participantsCount ?? 0} attempts`}{" "}
                • Created on{" "}
                <span className="text-cyan-200">
                  {new Date(it.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              {/* Copy link */}
              <button
                onClick={() => handleCopyLink(it._id)}
                className="px-3 py-1 rounded text-sm font-medium border border-cyan-600 text-cyan-300 bg-transparent hover:bg-cyan-600/10"
              >
                Copy Id
              </button>

              {/* Status dropdown (compact) */}
              <div className="inline-block relative">
                <select
                  value={it.status}
                  onChange={(e) => onStatusChange(it._id, e.target.value)}
                  className="px-2 py-1 rounded bg-[#0b0c12] border border-gray-700 text-sm text-gray-200"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* quick nav */}
              {title === "Polls" && (
                <Link
                  // to={`/host/${type}/${it._id}`}
                  to={`/poll/${it._id}/results`}
                  className="px-3 py-1 rounded text-sm font-medium bg-violet-600/20 text-violet-300 border border-violet-700 hover:bg-violet-600/30"
                >
                  Results
                </Link>
              )}
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
