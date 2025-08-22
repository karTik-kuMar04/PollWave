import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api.js";

const tabs = [
  { id: "quizzes", label: "Quizzes" },
  { id: "polls", label: "Polls" },
];

const MyEventsTabs = () => {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [loadingPolls, setLoadingPolls] = useState(false);
  const [errorPolls, setErrorPolls] = useState("");
  const [, setLoadingQuizzes] = useState(false);
  const [, setErrorQuizzes] = useState("");

  // to get quizzes from the backend

  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    if (activeTab !== "quizzes") return;

    const fetchQuizzes = async () => {
      try {
        setErrorQuizzes("");
        setLoadingQuizzes(true);
        const res = await axios.get(
          `${API_BASE_URL}/myquiz/responses`,
          { withCredentials: true }
        );

        setQuizzes(res.data.responceOnQuiz || []);
      }catch (err) {
        setErrorQuizzes(
          err.response?.data?.message || "Failed to load your poll responses."
        );
      } finally {
        setLoadingQuizzes(false);
      }
    }

    fetchQuizzes();
  },[activeTab])



  
  // to get poll responses from the backend
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    if (activeTab !== "polls") return;

    const fetchPollResponses = async () => {
      try {
        setErrorPolls("");
        setLoadingPolls(true);
        const res = await axios.get(
          `${API_BASE_URL}/mypolls/responses`,
          { withCredentials: true }
        );
        setPolls(res.data.responseOnPoll || []);
      } catch (err) {
        setErrorPolls(
          err.response?.data?.message || "Failed to load your poll responses."
        );
      } finally {
        setLoadingPolls(false);
      }
    };

    fetchPollResponses();
  }, [activeTab]);

  const totalQuizzes = quizzes.length;


  const totalPolls = polls.length;

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Joined Quizzes" value={totalQuizzes} hint="All-time" />
        <StatCard title="Polls Voted" value={totalPolls} hint="All-time" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              activeTab === t.id
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-600"
                : "bg-[#1c1e32] text-gray-300 border-[#2a2c48] hover:bg-[#1a1c34]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "quizzes" ? (
        <QuizzesTable quizzes={quizzes} />
      ) : (
        <PollsTable polls={polls} loading={loadingPolls} error={errorPolls} />
      )}
    </div>
  );
};

export default MyEventsTabs;

/* ---------- Subcomponents ---------- */

function StatCard({ title, value, hint }) {
  return (
    <div className="bg-[#1c1e32] rounded-xl p-5 border border-[#242746]">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="mt-1 text-3xl font-bold">{value}</div>
      <div className="mt-2 text-xs text-gray-500">{hint}</div>
    </div>
  );
}

import { Link } from "react-router-dom";

function QuizzesTable({ quizzes }) {
  return (
    <div className="bg-[#1c1e32] rounded-xl border border-[#242746] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#242746] flex items-center justify-between">
        <h2 className="text-lg font-semibold">Joined Quizzes</h2>
      </div>
      {quizzes.length === 0 ? (
        <EmptyState message="You haven't joined any quizzes yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#171935] text-gray-400">
              <tr>
                <Th>Event Title</Th>
                <Th>Date of Participation</Th>
                <Th>Score</Th>
                <Th>Result</Th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q) => {
                const title = q?.quiz?.title || "Untitled Quiz";
                const score = q?.score ?? "—";
                const quizId = q?.quiz?._id;
                const resultId = q?._id; // assuming quizResult doc has _id

                return (
                  <tr
                    key={q._id || q.createdAt}
                    className="border-t border-[#242746] hover:bg-[#171935]/60"
                  >
                    <Td className="font-medium">{title}</Td>
                    <Td>{prettyDate(q.createdAt)}</Td>
                    <Td>
                      <Badge>{score} points</Badge>
                    </Td>
                    <Td>
                      {quizId && resultId ? (
                        <Link
                          to={`/quiz/${quizId}/result/${resultId}`}
                          className="text-blue-400 hover:underline"
                        >
                          View Result
                        </Link>
                      ) : (
                        "—"
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



function PollsTable({ polls, loading, error }) {
  return (
    <div className="bg-[#1c1e32] rounded-xl border border-[#242746] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#242746] flex items-center justify-between">
        <h2 className="text-lg font-semibold">Joined Polls</h2>
      </div>

      {loading ? (
        <div className="p-6 text-gray-400">Loading your poll responses…</div>
      ) : error ? (
        <div className="p-6 text-rose-300">{error}</div>
      ) : polls.length === 0 ? (
        <EmptyState message="You haven't voted on any polls yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#171935] text-gray-400">
              <tr>
                <Th>Event Title</Th>
                <Th>Date of Participation</Th>
                <Th>Voted For</Th>
                <Th>When</Th>
              </tr>
            </thead>
            <tbody>
              {polls.map((p) => {
                const title = p?.poll?.title || "Untitled poll";
                const opts = Array.isArray(p?.poll?.options) ? p.poll.options : [];
                const chosen = Array.isArray(p?.selectedOptionIds) ? p.selectedOptionIds : [];
                const votedTexts = opts
                  .filter((o) => chosen.includes(o._id))
                  .map((o) => o.text);

                return (
                  <tr key={p._id || p.createdAt} className="border-t border-[#242746] hover:bg-[#171935]/60">
                    <Td className="font-medium">{title}</Td>
                    <Td>{prettyDate(p.createdAt)}</Td>
                    <Td>
                      {votedTexts.length ? (
                        <div className="flex flex-wrap gap-1">
                          {votedTexts.map((t, i) => (
                            <Badge key={i}>{t}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </Td>
                    <Td className="text-gray-400">{timeAgo(p.createdAt)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- tiny UI bits ---------- */
function Th({ children }) {
  return <th className="text-left px-5 py-3 text-xs uppercase tracking-wide">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-5 py-3 align-middle ${className}`}>{children}</td>;
}
function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full border border-[#2a2c48] bg-[#11142a] text-gray-200 text-xs">
      {children}
    </span>
  );
}
function EmptyState({ message }) {
  return (
    <div className="p-10 text-center text-gray-400">
      <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-[#171935] flex items-center justify-center">✨</div>
      {message}
    </div>
  );
}

/* ---------- helpers ---------- */
function prettyDate(dateLike) {
  try {
    const d = new Date(dateLike);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}
function timeAgo(dateLike) {
  try {
    const d = new Date(dateLike);
    const diff = Date.now() - d.getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  } catch {
    return "";
  }
}
