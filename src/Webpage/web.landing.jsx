import React from "react";
import { Link } from "react-router-dom";
import "./landing.css";
import { TiPencil } from "react-icons/ti";
import { PiTrophyThin } from "react-icons/pi";
import { HiOutlineHashtag } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { PiUsersThree } from "react-icons/pi";
import { FaLinkedin } from "react-icons/fa";
import { VscGithubAlt } from "react-icons/vsc";

function Landing() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#141118] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: `"Spline Sans", "Noto Sans", sans-serif` }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#302839] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              PollWave
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex gap-2">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#7f0cf2] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Sign Up</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#302839] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Login</span>
              </button>
            </div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
                  style={{background: "linear-gradient(to top right, #2f2e5b, #aa294f, #db682c)"}}
                >
                  <div className="flex flex-col gap-2 text-left">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      Host Live Polls &amp; Quizzes in Seconds
                    </h1>
                    <h2 className="text-white text-sm font-normal italic leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Engage your audience with interactive polls and timed
                      quizzes in real-time.
                    </h2>
                  </div>
                  <div className="flex-wrap gap-3 flex">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#7f0cf2] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                      <span className="truncate">Host a Session</span>
                    </button>
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#302839] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                      <span className="truncate">Join with Code</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Features
            </h2>
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1 className="text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                  What you can do with PollWave
                </h1>
                <p className="text-white text-base italic leading-normal max-w-[720px]">
                  Explore the powerful features that make PollWave the ultimate
                  platform for interactive events.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <div className="flex flex-1 gap-3 rounded-lg border border-[#473b54] bg-[#211b27] p-4 flex-col cursor-pointer">
                  <div
                    className="text-white"
                    data-icon="Pencil"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <span
                      className="text-white w-[20px] h-[20px] text-2xl"
                    >
                      <TiPencil />
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-base font-bold leading-tight">
                      Create &amp; Customize Polls
                    </h2>
                    <p className="text-[#ab9cba] text-sm font-normal leading-normal italic">
                      Design polls with various question types and options to
                      suit your needs.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#473b54] bg-[#211b27] p-4 flex-col cursor-pointer">
                  <div
                    className="text-white"
                    data-icon="Trophy"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <span
                      className="text-white w-[20px] h-[20px] text-2xl"
                    >
                      <PiTrophyThin />
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-base font-bold leading-tight">
                      Host Quizzes with Live Scores
                    </h2>
                    <p className="text-[#ab9cba] text-sm font-normal leading-normal italic">
                      Run quizzes with real-time leaderboards and instant
                      feedback.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#473b54] bg-[#211b27] p-4 flex-col cursor-pointer">
                  <div
                    className="text-white"
                    data-icon="Hash"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <span
                      className="text-white w-[20px] h-[20px] text-2xl"
                    >
                      <HiOutlineHashtag />
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-base font-bold leading-tight">
                      Easy Code-based Joining
                    </h2>
                    <p className="text-[#ab9cba] text-sm font-normal leading-normal italic">
                      Participants can join sessions quickly using a unique
                      code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              User Types
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-1 gap-3 rounded-lg border border-[#473b54] bg-[#211b27] p-4 flex-col cursor-pointer">
                <div
                  className="text-white"
                  data-icon="User"
                  data-size="24px"
                  data-weight="regular"
                >
                 <span
                    className="text-white w-[20px] h-[20px] text-[24px]"
                  >
                  <FaRegUser />
                 </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-white text-base font-bold leading-tight">
                    Host
                  </h2>
                  <p className="text-[#ab9cba] text-sm font-normal leading-normal italic">
                    Create polls/quizzes, view results
                  </p>
                </div>
              </div>
              <div className="flex flex-1 gap-3 rounded-lg border border-[#473b54] bg-[#211b27] p-4 flex-col cursor-pointer">
                <div
                  className="text-white"
                  data-icon="UsersThree"
                  data-size="24px"
                  data-weight="regular"
                >
                  <span
                    className="text-white w-[20px] h-[20px] text-[24px]"
                  >
                    <PiUsersThree />
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-white text-base font-bold leading-tight">
                    Participant
                  </h2>
                  <p className="text-[#ab9cba] text-sm font-normal leading-normal italic">
                    Join sessions, answer questions
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#7f0cf2] text-white text-sm font-bold leading-normal tracking-[0.015em] grow">
                  <span className="truncate">Get Started as Host</span>
                </button>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#302839] text-white text-sm font-bold leading-normal tracking-[0.015em] grow">
                  <span className="truncate">Join as Participant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a
                  className="text-[#ab9cba] text-base font-normal leading-normal min-w-40"
                  href="#"
                >
                  About
                </a>
                <a
                  className="text-[#ab9cba] text-base font-normal leading-normal min-w-40"
                  href="#"
                >
                  Terms
                </a>
                <a
                  className="text-[#ab9cba] text-base font-normal leading-normal min-w-40"
                  href="#"
                >
                  Privacy
                </a>
                <a
                  className="text-[#ab9cba] text-base font-normal leading-normal min-w-40"
                  href="#"
                >
                  Help
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://www.linkedin.com/in/kartik-kumar-2264662a9/" target="_blank">
                  <div
                    className="text-[#ab9cba]"
                    data-icon="LinkedinLogo"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <span
                      className="text-white text-2xl "
                    >
                      <FaLinkedin />
                    </span>
                  </div>
                </a>
                <a href="https://github.com/karTik-kuMar04" target="_blank">
                  <div
                    className="text-[#ab9cba]"
                    data-icon="GithubLogo"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <span
                      className="text-white text-2xl font-bold"
                    >
                      <VscGithubAlt />
                    </span>
                  </div>
                </a>
              </div>
              <p className="text-[#ab9cba] text-base font-normal leading-normal">
                © 2024 PollWave. All rights reserved.
              </p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
