import React from "react";
import Header from "../Component/Header";
import MyEventsTabs from "../Component/MyEventsTabs";

const MyEvents = () => {
  return (
    <div className="min-h-screen bg-[#0f1123] text-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600/20 via-cyan-600/10 to-transparent border-b border-[#1c1e32]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            My Events
          </h1>
          <p className="mt-2 text-gray-300">
            Review your joined quizzes, poll votes, and recent activity.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <MyEventsTabs />
      </main>
    </div>
  );
};

export default MyEvents;

