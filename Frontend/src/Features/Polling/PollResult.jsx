// src/pages/PollResult.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api.js";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

export default function PollResult() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    axios
      .get(`${API_BASE_URL}/polls/${pollId}/results`, { withCredentials: true })
      .then((res) => {
        if (!mounted) return;
        setPoll(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Failed to load results");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [pollId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="animate-pulse text-gray-500">Loading results…</div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-red-500">No results found for this poll.</div>
      </div>
    );
  }

  // Normalize data
  const results = (poll.results || []).map((r) => ({
    id: r._id,
    name: String(r.text ?? "Option"),
    votes: Number(r.votes ?? 0),
  }));

  const totalVotes = results.reduce((s, r) => s + r.votes, 0);
  const maxVotes = results.reduce((m, r) => Math.max(m, r.votes), 0);
  const yMax = Math.max(1, Math.ceil(maxVotes * 1.15) + 1);

  const chartData = results.map((r) => ({
    ...r,
    pct: totalVotes > 0 ? Math.round((r.votes / totalVotes) * 100) : 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{poll.title}</h1>
            {poll.description && (
              <p className="text-gray-600 text-sm mt-1">{poll.description}</p>
            )}
          </div>
          <button
            onClick={() => navigate("/host/dashboard")}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition text-sm font-medium shadow"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm text-gray-500">Total Responses</div>
            <div className="text-3xl font-semibold">{totalVotes}</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm text-gray-500">Options</div>
            <div className="text-3xl font-semibold">{results.length}</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow">
          {totalVotes === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-4xl mb-3">📊</div>
              No votes yet.
            </div>
          ) : (
            <>
              <div style={{ width: "100%", height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 24, right: 16, left: 8, bottom: 48 }}
                    barCategoryGap="35%"
                  >
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#475569", fontSize: 13 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#475569"
                      domain={[0, yMax]}
                      allowDecimals={false}
                      tick={{ fill: "#475569", fontSize: 13 }}
                    />
                    <Tooltip
                      wrapperStyle={{ outline: "none", borderRadius: 8 }}
                      contentStyle={{
                        background: "white",
                        border: "1px solid #e2e8f0",
                        color: "#1e293b",
                      }}
                      formatter={(value) => [`${value} votes`, ""]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar
                      dataKey="votes"
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                      barSize={20}
                    >
                      <LabelList
                        dataKey="votes"
                        position="top"
                        formatter={(val) => (val > 0 ? val : "")}
                        fill="#1e293b"
                        style={{ fontWeight: 600, fontSize: 12 }}
                      />
                    </Bar>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Breakdown */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chartData.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400/40 transition"
                  >
                    <div
                      className="w-2 h-10 rounded-full"
                      style={{
                        background: "linear-gradient(to bottom, #60a5fa, #2563eb)",
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium truncate">{d.name}</div>
                      <div className="text-xs text-gray-500">
                        {d.pct}% • {d.votes} vote{d.votes !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
