import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api.js";






export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState("polls"); // 'polls' | 'quizzes' | 'both'
  const [showSidebar, setShowSidebar] = useState(true);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();







  const [user, setUser] = React.useState();
  const [polls, setPolls] = React.useState([]);
  const [quizzes, setQuizzes] = React.useState([])

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
  }



    // inside HostDashboard component, before return
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
      <div className="flex items-center justify-center min-h-screen text-lg">
        <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading dashboard…
      </div>
    );
  }   

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex h-full">
        {/* SIDEBAR */}
        <aside className={`hidden md:flex md:flex-col md:w-64 p-4 gap-6 bg-gray-800 border-r border-gray-700 shadow-sm ${showSidebar ? "" : "-translate-x-full"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">PW</div>
            <div>
              <h3 className="font-semibold">PollWave</h3>
              <p className="text-xs text-gray-400">Host Dashboard</p>
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              <li className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">Dashboard</li>
              <li className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">Polls</li>
              <li className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">Quizzes</li>
              <li className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">Analytics</li>
              <li className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">Settings</li>
            </ul>
          </nav>

          <div className="mt-auto">
            <button onClick={handleLogOut} className="w-full text-left px-3 py-2 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30">Logout</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1">
          {/* HEADER */}
          <header className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between gap-4 p-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <button className="md:hidden p-2 rounded hover:bg-gray-700" onClick={() => setShowSidebar((s) => !s)}>
                  ☰
                </button>
                <h2 className="text-xl font-semibold">Dashboard</h2>
                {/* Search Bar
                
                  <div className="ml-4 hidden sm:block">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search polls, quizzes..."
                      className="px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded w-64 text-sm placeholder-gray-400"
                    />
                  </div>
                
                */}
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex gap-2">
                  <Link to="/host/create-poll" className="px-3 py-2 bg-indigo-600 text-white rounded hover:opacity-95">Create Poll</Link>
                  <Link to="/host/create-quiz" className="px-3 py-2 bg-emerald-600 text-white rounded hover:opacity-95">Create Quiz</Link>
                </div>

                <div className="relative">
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-600 bg-gray-700 rounded">
                    <span className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center text-sm">{user?.fullName?.charAt(0).toUpperCase()}</span>
                    <span className="hidden sm:block">{user?.fullName}</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="max-w-7xl mx-auto p-6">
            {/* STATS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Polls" value={polls?.length} subtitle="Active & drafts" />
              <StatCard title="Total Quizzes" value={quizzes?.length} subtitle="Published & scheduled" icon="/quiz-icon.webp"/>
              <StatCard title="Responses" value={totalResponses} subtitle="All time" />
            </section>

            {/* TAB TOGGLE */}
            <section className="bg-gray-800 p-4 rounded shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tab label="Polls" active={activeTab === "polls"} onClick={() => setActiveTab("polls")} />
                  <Tab label="Quizzes" active={activeTab === "quizzes"} onClick={() => setActiveTab("quizzes")} />
                  <Tab label="Both" active={activeTab === "both"} onClick={() => setActiveTab("both")} />
                </div>

                <div className="text-sm text-gray-400">Showing: <strong>{activeTab}</strong></div>
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

            {/* QUICK LINKS + CTA */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="p-4 bg-gray-800 rounded shadow-sm">
                  <h3 className="font-semibold mb-2">Recent activity</h3>
                  <p className="text-sm text-gray-400">No major activity to show. When users respond to polls or quizzes, you’ll see a summary here.</p>
                </div>
              </div>
              {/*
                <aside>
                  <div className="p-4 bg-gray-800 rounded shadow-sm">
                    <h4 className="font-semibold">Quick actions</h4>
                    <div className="mt-3 flex flex-col gap-2">
                      <button className="px-3 py-2 rounded border border-gray-600 text-left bg-gray-700 hover:bg-gray-600">Publish a Poll</button>
                      <button className="px-3 py-2 rounded border border-gray-600 text-left bg-gray-700 hover:bg-gray-600">Schedule Quiz</button>
                      <button className="px-3 py-2 rounded border border-gray-600 text-left bg-gray-700 hover:bg-gray-600">View Analytics</button>
                    </div>
                  </div>
                </aside>
              */}
            </section>
          </div>
        </main>
      </div>

      
    </div>
  );
}

/* ---------- Helper components (inside single file for demo) ---------- */
function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="p-4 bg-gray-800 rounded shadow-sm flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      </div>
      <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center"><img className="text-center rounded w-10 h-10" src={icon} alt="" /></div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded border border-gray-600 ${active ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
    >
      {label}
    </button>
  );
}

function ListSection({ title, items, type = "poll", onStatusChange }) {
  const statusOptions = ["draft", "active", "closed"];

  const handleCopyLink = (id) => {
    // example share URL (frontend route for participants)
    const Id = id;
      

    navigator.clipboard.writeText(Id).then(() => {
      alert("Id copied to clipboard! share it with participants.");
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 space-y-3">
        {items.length === 0 && (
          <div className="text-sm text-gray-400">
            No {title.toLowerCase()} found.
          </div>
        )}
        {items.map((it, idx) => (
          <div
            key={idx}
            className="p-3 border border-gray-700 rounded flex items-center justify-between bg-gray-800"
          >
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-xs text-gray-400">
                {type === "poll"
                  ? `${it.participants ?? 0} responses`
                  : `${it.participantsCount ?? 0} attempts`}{" "}
                • Created on {new Date(it.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
              </div>
            </div>

            {/* STATUS BUTTONS */}
            <div className="flex items-center gap-2">
              {/* Copy link */}
              <button
                onClick={() => handleCopyLink(it._id)}
                className="px-2 py-1 rounded text-sm border bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Copy Link
              </button>

                          
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(it._id, status)}
                  className={`px-2 py-1 rounded text-sm border ${
                    it.status === status
                      ? "bg-indigo-600 text-white border-indigo-500"
                      : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

