import React from "react";
import "./landing.css";
import { Link } from "react-router-dom";
import { FaRegUser, FaLinkedin } from "react-icons/fa6";
import { VscGithubAlt } from "react-icons/vsc";
import { PiUsersThree, PiTrophy } from "react-icons/pi";
import { TiPencil } from "react-icons/ti";
import { HiOutlineHashtag } from "react-icons/hi2";

function Landing() {
  return (
    <div className="bg-[#0b0f17] text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500">
            PW
          </div>
          <h1 className="text-lg font-extrabold">PollWave</h1>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-700 hover:bg-gray-800 transition"
          >
            Login
          </Link>
          <Link
            to="/registration"
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-5xl text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Interactive Polls & Quizzes Made Simple
          </h2>
          <p className="mt-5 text-gray-300 text-lg max-w-2xl mx-auto">
            Host engaging sessions, run real-time quizzes, and collect instant
            feedback with PollWave. Perfect for events, classrooms, and live
            streams.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/host/create-poll"
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
            >
              Host a Session
            </Link>
            <Link
              to="/participant/join"
              className="px-6 py-3 rounded-lg font-semibold border border-gray-700 hover:bg-gray-800 transition"
            >
              Join with Code
            </Link>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-[#101522] py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold">Why PollWave?</h3>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Create Polls Easily"
              desc="Customize polls with multiple formats and themes."
              icon={<TiPencil className="text-3xl" />}
            />
            <FeatureCard
              title="Host Live Quizzes"
              desc="Track scores and leaderboards in real-time."
              icon={<PiTrophy className="text-3xl" />}
            />
            <FeatureCard
              title="Quick Join Codes"
              desc="Participants join instantly using codes or QR."
              icon={<HiOutlineHashtag className="text-3xl" />}
            />
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="bg-[#0b0f17] py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold">Who Can Use?</h3>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <UserCard
              title="Hosts"
              desc="Create, manage, and analyze sessions."
              icon={<FaRegUser className="text-2xl" />}
            />
            <UserCard
              title="Participants"
              desc="Join live, vote, and see instant results."
              icon={<PiUsersThree className="text-2xl" />}
            />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/registration?role=host"
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
            >
              Get Started as Host
            </Link>
            <Link
              to="/registration?role=participant"
              className="px-6 py-3 rounded-lg font-semibold border border-gray-700 hover:bg-gray-800 transition"
            >
              Join as Participant
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101522] border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 text-gray-400 text-sm">
            <Link to="/about" className="hover:text-white">
              About
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/help" className="hover:text-white">
              Help
            </Link>
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/karTik-kuMar04"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <VscGithubAlt className="text-2xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/kartik-kumar-2264662a9/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaLinkedin className="text-2xl" />
            </a>
          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PollWave. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-[#181e2a] p-6 rounded-xl text-left hover:bg-[#1f2634] transition shadow-lg">
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

function UserCard({ title, desc, icon }) {
  return (
    <div className="bg-[#181e2a] p-6 rounded-xl flex items-start gap-4 hover:bg-[#1f2634] transition shadow-lg">
      <div className="text-purple-400">{icon}</div>
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-gray-400 text-sm">{desc}</p>
      </div>
    </div>
  );
}

export default Landing;
